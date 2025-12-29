#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { analyzeLinks } from "./lib/analyzers.ts";
import { fetchPage } from "./lib/fetcher.ts";
import { formatLinkAnalysis } from "./lib/formatters.ts";
import { parseButtons, parseLinks } from "./lib/parser.ts";

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
		"check-external": {
			type: "boolean",
			short: "e",
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
Usage: bun check-links.ts <url> [options]

Analyze links and buttons for navigation and accessibility issues.

Options:
  -v, --verbose         Show all links including valid ones
  -j, --json            Output results as JSON
  -e, --check-external  Verify external links are reachable (slower)
  -h, --help            Show this help message

Examples:
  bun check-links.ts https://example.com
  bun check-links.ts https://example.com --verbose
  bun check-links.ts https://example.com --check-external
  bun check-links.ts https://example.com --json
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

		console.log("Parsing links and buttons...");
		const links = parseLinks(html);
		const buttons = parseButtons(html);

		console.log("Analyzing...\n");
		const analysis = analyzeLinks(normalizedUrl, links, buttons);

		if (values.json) {
			console.log(JSON.stringify(analysis, null, 2));
		} else {
			console.log(formatLinkAnalysis(analysis, values.verbose ?? false));
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
