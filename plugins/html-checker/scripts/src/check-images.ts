#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { analyzeImages } from "./lib/analyzers.ts";
import { fetchPage } from "./lib/fetcher.ts";
import { parseImages } from "./lib/parser.ts";
import type { ImageAnalysis, Severity } from "./lib/types.ts";

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

function formatAnalysis(analysis: ImageAnalysis, verbose: boolean): string {
	const lines: string[] = [];

	lines.push(`${COLORS.bold}Image Analysis for ${analysis.url}${COLORS.reset}`);
	lines.push("");

	lines.push(`${COLORS.bold}Summary:${COLORS.reset}`);
	lines.push(`  Total Images: ${analysis.stats.total}`);
	lines.push(`  With alt: ${analysis.stats.withAlt}`);
	lines.push(`  Missing alt: ${analysis.stats.missingAlt}`);
	lines.push(`  Empty alt: ${analysis.stats.emptyAlt}`);
	lines.push(`  With dimensions: ${analysis.stats.withDimensions}`);
	lines.push(`  With lazy loading: ${analysis.stats.withLazyLoading}`);
	lines.push("");

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
			if (verbose && issue.image) {
				const src =
					issue.image.src.length > 50
						? `${issue.image.src.substring(0, 47)}...`
						: issue.image.src;
				lines.push(`    ${COLORS.gray}<img src="${src}">${COLORS.reset}`);
			}
			if (issue.details) {
				lines.push(`    ${COLORS.gray}${issue.details}${COLORS.reset}`);
			}
		}
	}

	return lines.join("\n");
}

function showHelp(): void {
	console.log(`
Usage: bun check-images.ts <url> [options]

Analyze images for accessibility and SEO compliance.

Options:
  -v, --verbose  Show image source details
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

		console.log("Parsing images...");
		const images = parseImages(html);

		console.log("Analyzing...\n");
		const analysis = analyzeImages(normalizedUrl, images);

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
