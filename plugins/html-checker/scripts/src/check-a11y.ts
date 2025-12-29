#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { fetchPage } from "./lib/fetcher.ts";
import type {
	A11yAnalysis,
	A11yInfo,
	A11yIssue,
	Severity,
} from "./lib/types.ts";

const { values, positionals } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		verbose: { type: "boolean", short: "v", default: false },
		json: { type: "boolean", short: "j", default: false },
		level: { type: "string", short: "l", default: "AA" },
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

function severityColor(severity: Severity): string {
	switch (severity) {
		case "error":
			return COLORS.red;
		case "warning":
			return COLORS.yellow;
		case "info":
			return COLORS.cyan;
	}
}

function parseA11yInfo(html: string): A11yInfo {
	// Extract lang
	const langMatch = /<html[^>]*lang\s*=\s*["']([^"']*)["']/i.exec(html);

	// Check skip link
	const hasSkipLink =
		/<a[^>]*href\s*=\s*["']#(?:main|content|skip)[^"']*["']/i.test(html) ||
		/class\s*=\s*["'][^"']*skip[^"']*["']/i.test(html);

	// Check landmarks
	const hasMain = /<main|role\s*=\s*["']main["']/i.test(html);
	const navCount = (html.match(/<nav|role\s*=\s*["']navigation["']/gi) || [])
		.length;
	const hasHeader = /<header|role\s*=\s*["']banner["']/i.test(html);
	const hasFooter = /<footer|role\s*=\s*["']contentinfo["']/i.test(html);

	// Count empty links
	let emptyLinks = 0;
	const linkMatches = html.matchAll(/<a([^>]*)>([\s\S]*?)<\/a>/gi);
	for (const match of linkMatches) {
		const attrs = match[1];
		const content = match[2];
		const text = content.replace(/<[^>]*>/g, "").trim();
		const ariaLabel = /aria-label\s*=\s*["']([^"']*)["']/i.exec(attrs);
		const imgAlt = /<img[^>]*alt\s*=\s*["']([^"']*)["']/i.exec(content);
		if (!text && !ariaLabel?.[1] && !imgAlt?.[1]) {
			emptyLinks++;
		}
	}

	// Count empty buttons
	let emptyButtons = 0;
	const buttonMatches = html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/gi);
	for (const match of buttonMatches) {
		const attrs = match[1];
		const content = match[2];
		const text = content.replace(/<[^>]*>/g, "").trim();
		const ariaLabel = /aria-label\s*=\s*["']([^"']*)["']/i.exec(attrs);
		if (!text && !ariaLabel?.[1]) {
			emptyButtons++;
		}
	}

	// Check focusable in aria-hidden
	let focusableHidden = 0;
	const ariaHiddenMatches = html.matchAll(
		/aria-hidden\s*=\s*["']true["'][^>]*>([\s\S]*?)<\/[^>]+>/gi,
	);
	for (const match of ariaHiddenMatches) {
		const content = match[1];
		if (/<(?:a|button|input|select|textarea|\[tabindex\])/i.test(content)) {
			focusableHidden++;
		}
	}

	// Check positive tabindex
	let positiveTabindex = 0;
	const tabindexMatches = html.matchAll(/tabindex\s*=\s*["'](\d+)["']/gi);
	for (const match of tabindexMatches) {
		if (Number.parseInt(match[1], 10) > 0) {
			positiveTabindex++;
		}
	}

	return {
		lang: langMatch ? langMatch[1] : null,
		hasSkipLink,
		landmarks: {
			main: hasMain,
			nav: navCount,
			header: hasHeader,
			footer: hasFooter,
		},
		emptyLinks,
		emptyButtons,
		focusableHidden,
		positiveTabindex,
	};
}

function analyzeA11y(url: string, info: A11yInfo): A11yAnalysis {
	const issues: A11yIssue[] = [];
	let score = 100;

	// Language check
	if (!info.lang) {
		issues.push({
			severity: "error",
			type: "missing-lang",
			wcag: "3.1.1",
			message: "Page is missing lang attribute on <html>",
			details:
				"Screen readers need the language to pronounce content correctly",
		});
		score -= 15;
	}

	// Skip link
	if (!info.hasSkipLink) {
		issues.push({
			severity: "warning",
			type: "missing-skip-link",
			wcag: "2.4.1",
			message: "No skip navigation link found",
			details: 'Add <a href="#main" class="skip-link">Skip to content</a>',
		});
		score -= 10;
	}

	// Main landmark
	if (!info.landmarks.main) {
		issues.push({
			severity: "warning",
			type: "missing-main-landmark",
			wcag: "1.3.1",
			message: "No <main> landmark found",
			details: "Use <main> to identify the primary content area",
		});
		score -= 10;
	}

	// Empty links
	if (info.emptyLinks > 0) {
		issues.push({
			severity: "error",
			type: "empty-link",
			wcag: "2.4.4",
			message: `${info.emptyLinks} link(s) with no accessible name`,
			details: "Add text content, aria-label, or img alt to links",
		});
		score -= Math.min(20, info.emptyLinks * 5);
	}

	// Empty buttons
	if (info.emptyButtons > 0) {
		issues.push({
			severity: "error",
			type: "empty-button",
			wcag: "4.1.2",
			message: `${info.emptyButtons} button(s) with no accessible name`,
			details: "Add text content or aria-label to buttons",
		});
		score -= Math.min(20, info.emptyButtons * 5);
	}

	// Focusable in aria-hidden
	if (info.focusableHidden > 0) {
		issues.push({
			severity: "error",
			type: "focusable-hidden",
			wcag: "4.1.2",
			message: `${info.focusableHidden} focusable element(s) inside aria-hidden`,
			details: "Remove focusable elements from aria-hidden containers",
		});
		score -= Math.min(15, info.focusableHidden * 5);
	}

	// Positive tabindex
	if (info.positiveTabindex > 0) {
		issues.push({
			severity: "warning",
			type: "positive-tabindex",
			wcag: "2.4.3",
			message: `${info.positiveTabindex} element(s) with tabindex > 0`,
			details:
				"Positive tabindex disrupts natural focus order. Use 0 or -1 instead.",
		});
		score -= Math.min(10, info.positiveTabindex * 2);
	}

	return {
		url,
		info,
		issues,
		score: Math.max(0, score),
		timestamp: new Date().toISOString(),
	};
}

function formatAnalysis(analysis: A11yAnalysis, verbose: boolean): string {
	const lines: string[] = [];
	const info = analysis.info;

	lines.push(
		`${COLORS.bold}Accessibility Audit for ${analysis.url}${COLORS.reset}`,
	);
	lines.push(`WCAG Level: ${values.level}`);
	lines.push("");

	// Page structure
	lines.push(`${COLORS.bold}Page Structure:${COLORS.reset}`);
	const langStatus = info.lang
		? `${COLORS.green}[OK]${COLORS.reset} lang="${info.lang}"`
		: `${COLORS.red}[MISSING]${COLORS.reset}`;
	lines.push(`  Language: ${langStatus}`);
	const skipStatus = info.hasSkipLink
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.yellow}[MISSING]${COLORS.reset}`;
	lines.push(`  Skip link: ${skipStatus}`);
	lines.push("");

	// Landmarks
	lines.push(`${COLORS.bold}Landmarks:${COLORS.reset}`);
	const mainStatus = info.landmarks.main
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.yellow}[MISSING]${COLORS.reset}`;
	lines.push(`  <main>: ${mainStatus}`);
	lines.push(`  <nav>: ${info.landmarks.nav} found`);
	const headerStatus = info.landmarks.header
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.gray}[MISSING]${COLORS.reset}`;
	lines.push(`  <header>: ${headerStatus}`);
	const footerStatus = info.landmarks.footer
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.gray}[MISSING]${COLORS.reset}`;
	lines.push(`  <footer>: ${footerStatus}`);
	lines.push("");

	// Interactive elements
	lines.push(`${COLORS.bold}Interactive Elements:${COLORS.reset}`);
	lines.push(`  Empty links: ${info.emptyLinks}`);
	lines.push(`  Empty buttons: ${info.emptyButtons}`);
	lines.push(`  Focusable in aria-hidden: ${info.focusableHidden}`);
	lines.push(`  Positive tabindex: ${info.positiveTabindex}`);
	lines.push("");

	// Issues
	if (analysis.issues.length === 0) {
		lines.push(`${COLORS.green}No issues found${COLORS.reset}`);
	} else {
		lines.push(
			`${COLORS.bold}Issues Found: ${analysis.issues.length}${COLORS.reset}`,
		);
		for (const issue of analysis.issues) {
			const color = severityColor(issue.severity);
			lines.push(
				`  ${color}[${issue.severity.toUpperCase().padEnd(7)}]${COLORS.reset} ${issue.message}`,
			);
			lines.push(`    ${COLORS.gray}WCAG ${issue.wcag}${COLORS.reset}`);
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
Usage: bun check-a11y.ts <url> [options]

Perform accessibility audit for WCAG 2.1 compliance.

Options:
  -v, --verbose      Show detailed recommendations
  -j, --json         Output results as JSON
  -l, --level <A|AA|AAA>  WCAG level (default: AA)
  -h, --help         Show this help message
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

		console.log("Analyzing accessibility...\n");
		const info = parseA11yInfo(html);
		const analysis = analyzeA11y(normalizedUrl, info);

		if (values.json) {
			console.log(JSON.stringify(analysis, null, 2));
		} else {
			console.log(formatAnalysis(analysis, values.verbose ?? false));
		}

		const hasErrors = analysis.issues.some((i) => i.severity === "error");
		process.exit(hasErrors ? 1 : 0);
	} catch (error) {
		console.error(
			`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		process.exit(1);
	}
}

main();
