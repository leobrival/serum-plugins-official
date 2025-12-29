#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { fetchPage } from "./lib/fetcher.ts";
import type {
	PerformanceAnalysis,
	PerformanceInfo,
	PerformanceIssue,
} from "./lib/types.ts";

const { values, positionals } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		verbose: { type: "boolean", short: "v", default: false },
		json: { type: "boolean", short: "j", default: false },
		help: { type: "boolean", short: "h", default: false },
	},
	allowPositionals: true,
});

const COLORS = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	green: "\x1b[32m",
	cyan: "\x1b[36m",
	gray: "\x1b[90m",
};

function impactColor(impact: "high" | "medium" | "low"): string {
	switch (impact) {
		case "high":
			return COLORS.red;
		case "medium":
			return COLORS.yellow;
		case "low":
			return COLORS.cyan;
	}
}

function parsePerformanceInfo(html: string, pageUrl: string): PerformanceInfo {
	const hostname = new URL(pageUrl).hostname;

	// Parse stylesheets
	const stylesheets: PerformanceInfo["stylesheets"] = [];
	const cssMatches = html.matchAll(
		/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi,
	);
	for (const match of cssMatches) {
		const attrs = match[0];
		const hrefMatch = /href\s*=\s*["']([^"']*)["']/i.exec(attrs);
		const mediaMatch = /media\s*=\s*["']([^"']*)["']/i.exec(attrs);
		const media = mediaMatch?.[1] || "all";

		if (hrefMatch) {
			stylesheets.push({
				url: hrefMatch[1],
				renderBlocking: media === "all" || !mediaMatch,
			});
		}
	}

	// Parse scripts
	const scripts: PerformanceInfo["scripts"] = [];
	const scriptMatches = html.matchAll(
		/<script[^>]*src\s*=\s*["']([^"']*)["'][^>]*>/gi,
	);
	for (const match of scriptMatches) {
		const attrs = match[0];
		const src = match[1];
		const hasAsync = /\basync\b/i.test(attrs);
		const hasDefer = /\bdefer\b/i.test(attrs);

		let isThirdParty = false;
		try {
			const scriptHost = new URL(src, pageUrl).hostname;
			isThirdParty = scriptHost !== hostname;
		} catch {
			isThirdParty = src.startsWith("http");
		}

		scripts.push({
			url: src,
			renderBlocking: !hasAsync && !hasDefer,
			isThirdParty,
		});
	}

	// Parse images
	const images: PerformanceInfo["images"] = [];
	const imgMatches = html.matchAll(/<img([^>]*)>/gi);
	for (const match of imgMatches) {
		const attrs = match[1];
		const srcMatch = /src\s*=\s*["']([^"']*)["']/i.exec(attrs);
		const loadingMatch = /loading\s*=\s*["']([^"']*)["']/i.exec(attrs);
		const widthMatch = /width\s*=\s*["']?(\d+)/i.exec(attrs);
		const heightMatch = /height\s*=\s*["']?(\d+)/i.exec(attrs);

		if (srcMatch) {
			images.push({
				url: srcMatch[1],
				hasLazy: loadingMatch?.[1] === "lazy",
				hasDimensions: !!(widthMatch && heightMatch),
			});
		}
	}

	// Parse iframes
	const iframes: PerformanceInfo["iframes"] = [];
	const iframeMatches = html.matchAll(/<iframe([^>]*)>/gi);
	for (const match of iframeMatches) {
		const attrs = match[1];
		const srcMatch = /src\s*=\s*["']([^"']*)["']/i.exec(attrs);
		const loadingMatch = /loading\s*=\s*["']([^"']*)["']/i.exec(attrs);

		if (srcMatch) {
			iframes.push({
				url: srcMatch[1],
				hasLazy: loadingMatch?.[1] === "lazy",
			});
		}
	}

	// Parse resource hints
	const resourceHints: PerformanceInfo["resourceHints"] = [];
	const hintMatches = html.matchAll(
		/<link[^>]*rel\s*=\s*["'](preconnect|preload|dns-prefetch)["'][^>]*>/gi,
	);
	for (const match of hintMatches) {
		const attrs = match[0];
		const rel = match[1];
		const hrefMatch = /href\s*=\s*["']([^"']*)["']/i.exec(attrs);

		if (hrefMatch) {
			resourceHints.push({ rel, href: hrefMatch[1] });
		}
	}

	// Count inline resources
	const inlineStyles = (html.match(/<style[^>]*>/gi) || []).length;
	const inlineScripts = (html.match(/<script(?![^>]*src)[^>]*>/gi) || [])
		.length;

	return {
		stylesheets,
		scripts,
		images,
		iframes,
		resourceHints,
		inlineStyles,
		inlineScripts,
	};
}

function analyzePerformance(
	url: string,
	info: PerformanceInfo,
): PerformanceAnalysis {
	const issues: PerformanceIssue[] = [];
	let score = 100;

	// Render-blocking CSS
	const blockingCss = info.stylesheets.filter((s) => s.renderBlocking);
	if (blockingCss.length > 0) {
		issues.push({
			severity: "warning",
			type: "render-blocking-css",
			impact: "high",
			message: `${blockingCss.length} render-blocking stylesheet(s)`,
			details: blockingCss.map((s) => s.url).join(", "),
		});
		score -= Math.min(20, blockingCss.length * 5);
	}

	// Render-blocking JS
	const blockingJs = info.scripts.filter((s) => s.renderBlocking);
	if (blockingJs.length > 0) {
		issues.push({
			severity: "warning",
			type: "render-blocking-js",
			impact: "high",
			message: `${blockingJs.length} render-blocking script(s)`,
			details: "Add async or defer attribute to non-critical scripts",
		});
		score -= Math.min(20, blockingJs.length * 5);
	}

	// Sync third-party scripts
	const syncThirdParty = info.scripts.filter(
		(s) => s.isThirdParty && s.renderBlocking,
	);
	if (syncThirdParty.length > 0) {
		issues.push({
			severity: "error",
			type: "sync-third-party",
			impact: "high",
			message: `${syncThirdParty.length} synchronous third-party script(s)`,
			details: "Third-party scripts should always be async or deferred",
		});
		score -= Math.min(15, syncThirdParty.length * 5);
	}

	// Images without lazy loading
	const noLazyImages = info.images.filter((i) => !i.hasLazy);
	if (noLazyImages.length > 5) {
		issues.push({
			severity: "info",
			type: "no-lazy-loading",
			impact: "medium",
			message: `${noLazyImages.length} images without lazy loading`,
			details: 'Add loading="lazy" to below-fold images',
		});
		score -= Math.min(10, Math.floor(noLazyImages.length / 3));
	}

	// Images without dimensions
	const noDimensions = info.images.filter((i) => !i.hasDimensions);
	if (noDimensions.length > 0) {
		issues.push({
			severity: "warning",
			type: "missing-dimensions",
			impact: "medium",
			message: `${noDimensions.length} image(s) without width/height`,
			details: "Set dimensions to prevent Cumulative Layout Shift (CLS)",
		});
		score -= Math.min(15, noDimensions.length * 2);
	}

	// Iframes without lazy loading
	const noLazyIframes = info.iframes.filter((i) => !i.hasLazy);
	if (noLazyIframes.length > 0) {
		issues.push({
			severity: "info",
			type: "no-lazy-loading",
			impact: "medium",
			message: `${noLazyIframes.length} iframe(s) without lazy loading`,
			details: 'Add loading="lazy" to iframes',
		});
		score -= Math.min(10, noLazyIframes.length * 3);
	}

	return {
		url,
		info,
		issues,
		score: Math.max(0, score),
		timestamp: new Date().toISOString(),
	};
}

function formatAnalysis(
	analysis: PerformanceAnalysis,
	verbose: boolean,
): string {
	const lines: string[] = [];
	const info = analysis.info;

	lines.push(
		`${COLORS.bold}Performance Analysis for ${analysis.url}${COLORS.reset}`,
	);
	lines.push("");

	// Resource summary
	lines.push(`${COLORS.bold}Resource Summary:${COLORS.reset}`);
	const blockingCss = info.stylesheets.filter((s) => s.renderBlocking).length;
	lines.push(
		`  Stylesheets: ${info.stylesheets.length} (${blockingCss} render-blocking)`,
	);
	const blockingJs = info.scripts.filter((s) => s.renderBlocking).length;
	lines.push(
		`  Scripts: ${info.scripts.length} (${blockingJs} render-blocking)`,
	);
	const lazyImages = info.images.filter((i) => i.hasLazy).length;
	lines.push(`  Images: ${info.images.length} (${lazyImages} lazy-loaded)`);
	const lazyIframes = info.iframes.filter((i) => i.hasLazy).length;
	lines.push(`  Iframes: ${info.iframes.length} (${lazyIframes} lazy-loaded)`);
	lines.push(`  Inline styles: ${info.inlineStyles}`);
	lines.push(`  Inline scripts: ${info.inlineScripts}`);
	lines.push("");

	// Resource hints
	lines.push(`${COLORS.bold}Resource Hints:${COLORS.reset}`);
	if (info.resourceHints.length === 0) {
		lines.push(`  ${COLORS.yellow}No resource hints found${COLORS.reset}`);
	} else {
		for (const hint of info.resourceHints) {
			lines.push(`  ${COLORS.green}[${hint.rel}]${COLORS.reset} ${hint.href}`);
		}
	}
	lines.push("");

	// Issues
	if (analysis.issues.length === 0) {
		lines.push(`${COLORS.green}No issues found${COLORS.reset}`);
	} else {
		lines.push(
			`${COLORS.bold}Issues Found: ${analysis.issues.length}${COLORS.reset}`,
		);
		for (const issue of analysis.issues) {
			const color = impactColor(issue.impact);
			lines.push(
				`  ${color}[${issue.impact.toUpperCase().padEnd(6)}]${COLORS.reset} ${issue.message}`,
			);
			if (verbose && issue.details) {
				lines.push(`    ${COLORS.gray}${issue.details}${COLORS.reset}`);
			}
		}
	}
	lines.push("");

	// Score
	const scoreColor =
		analysis.score >= 80
			? COLORS.green
			: analysis.score >= 50
				? COLORS.yellow
				: COLORS.red;
	lines.push(
		`${COLORS.bold}Score: ${scoreColor}${analysis.score}/100${COLORS.reset}`,
	);

	return lines.join("\n");
}

function showHelp(): void {
	console.log(`
Usage: bun check-performance.ts <url> [options]

Analyze performance-related HTML patterns.

Options:
  -v, --verbose  Show resource URLs
  -j, --json     Output results as JSON
  -h, --help     Show this help message
`);
}

async function main(): Promise<void> {
	if (values.help) {
		showHelp();
		process.exit(0);
	}

	const url = positionals[0];
	if (!url) {
		console.error("Error: URL is required");
		showHelp();
		process.exit(1);
	}

	const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		console.log(`Fetching ${normalizedUrl}...`);
		const html = await fetchPage(normalizedUrl);

		console.log("Analyzing performance...\n");
		const info = parsePerformanceInfo(html, normalizedUrl);
		const analysis = analyzePerformance(normalizedUrl, info);

		if (values.json) {
			console.log(JSON.stringify(analysis, null, 2));
		} else {
			console.log(formatAnalysis(analysis, values.verbose ?? false));
		}

		const hasHighImpact = analysis.issues.some((i) => i.impact === "high");
		process.exit(hasHighImpact ? 1 : 0);
	} catch (error) {
		console.error(
			`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		process.exit(1);
	}
}

main();
