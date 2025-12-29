#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { analyzeMeta } from "./lib/analyzers.ts";
import { fetchPage } from "./lib/fetcher.ts";
import { parseMeta } from "./lib/parser.ts";
import type { MetaAnalysis, Severity } from "./lib/types.ts";

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

function truncate(str: string | null, max: number): string {
	if (!str) return "(not set)";
	return str.length > max ? `${str.substring(0, max - 3)}...` : str;
}

function formatAnalysis(analysis: MetaAnalysis, verbose: boolean): string {
	const lines: string[] = [];
	const meta = analysis.meta;

	lines.push(`${COLORS.bold}Meta Analysis for ${analysis.url}${COLORS.reset}`);
	lines.push("");

	// Title and description
	lines.push(`${COLORS.bold}SEO Tags:${COLORS.reset}`);
	const titleStatus = meta.title
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.red}[MISSING]${COLORS.reset}`;
	const titleLen = meta.title ? ` (${meta.title.length} chars)` : "";
	lines.push(`  ${titleStatus} title: ${truncate(meta.title, 60)}${titleLen}`);

	const descStatus = meta.description
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.red}[MISSING]${COLORS.reset}`;
	const descLen = meta.description ? ` (${meta.description.length} chars)` : "";
	lines.push(
		`  ${descStatus} description: ${truncate(meta.description, 80)}${descLen}`,
	);

	const canonicalStatus = meta.canonical
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.yellow}[MISSING]${COLORS.reset}`;
	lines.push(`  ${canonicalStatus} canonical: ${truncate(meta.canonical, 60)}`);
	lines.push("");

	// Open Graph
	lines.push(`${COLORS.bold}Open Graph:${COLORS.reset}`);
	const ogTitleStatus = meta.ogTitle
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.gray}[MISSING]${COLORS.reset}`;
	lines.push(`  ${ogTitleStatus} og:title: ${truncate(meta.ogTitle, 60)}`);
	const ogDescStatus = meta.ogDescription
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.gray}[MISSING]${COLORS.reset}`;
	lines.push(
		`  ${ogDescStatus} og:description: ${truncate(meta.ogDescription, 60)}`,
	);
	const ogImgStatus = meta.ogImage
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.gray}[MISSING]${COLORS.reset}`;
	lines.push(`  ${ogImgStatus} og:image: ${truncate(meta.ogImage, 60)}`);
	lines.push("");

	// Twitter
	lines.push(`${COLORS.bold}Twitter Card:${COLORS.reset}`);
	const twCardStatus = meta.twitterCard
		? `${COLORS.green}[OK]${COLORS.reset}`
		: `${COLORS.gray}[MISSING]${COLORS.reset}`;
	lines.push(
		`  ${twCardStatus} twitter:card: ${truncate(meta.twitterCard, 40)}`,
	);
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
			if (verbose && issue.details) {
				lines.push(`    ${COLORS.gray}${issue.details}${COLORS.reset}`);
			}
		}
	}

	return lines.join("\n");
}

function showHelp(): void {
	console.log(`
Usage: bun check-meta.ts <url> [options]

Analyze meta tags for SEO and social sharing.

Options:
  -v, --verbose  Show detailed recommendations
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

		console.log("Parsing meta tags...");
		const meta = parseMeta(html);

		console.log("Analyzing...\n");
		const analysis = analyzeMeta(normalizedUrl, meta);

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
