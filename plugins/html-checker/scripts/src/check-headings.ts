#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { analyzeHeadings } from "./lib/analyzers.ts";
import { fetchPage } from "./lib/fetcher.ts";
import { formatHeadingAnalysis } from "./lib/formatters.ts";
import { parseHeadings } from "./lib/parser.ts";

const { values, positionals } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		verbose: {
			type: "boolean",
			short: "v",
			default: false,
		},
		json: {
			type: "boolean",
			short: "j",
			default: false,
		},
		help: {
			type: "boolean",
			short: "h",
			default: false,
		},
	},
	allowPositionals: true,
});

function showHelp(): void {
	console.log(`
Usage: bun check-headings.ts <url> [options]

Analyze HTML heading hierarchy (H1-H6) for SEO and accessibility.

Options:
  -v, --verbose  Show detailed heading content and hierarchy tree
  -j, --json     Output results as JSON
  -h, --help     Show this help message

Examples:
  bun check-headings.ts https://example.com
  bun check-headings.ts https://example.com --verbose
  bun check-headings.ts https://example.com --json
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

	// Normalize URL
	const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

	try {
		console.log(`Fetching ${normalizedUrl}...`);
		const html = await fetchPage(normalizedUrl);

		console.log("Parsing headings...");
		const headings = parseHeadings(html);

		console.log("Analyzing...\n");
		const analysis = analyzeHeadings(normalizedUrl, headings);

		if (values.json) {
			console.log(JSON.stringify(analysis, null, 2));
		} else {
			console.log(formatHeadingAnalysis(analysis, values.verbose ?? false));
		}

		// Exit with error code if critical issues found
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
