#!/usr/bin/env bun

import { parseArgs } from "node:util";
import { analyzeForms } from "./lib/analyzers.ts";
import { fetchPage } from "./lib/fetcher.ts";
import { parseForms } from "./lib/parser.ts";
import type { FormAnalysis, Severity } from "./lib/types.ts";

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

function formatAnalysis(analysis: FormAnalysis, verbose: boolean): string {
	const lines: string[] = [];

	lines.push(`${COLORS.bold}Form Analysis for ${analysis.url}${COLORS.reset}`);
	lines.push("");

	lines.push(`${COLORS.bold}Summary:${COLORS.reset}`);
	lines.push(`  Total Forms: ${analysis.stats.totalForms}`);
	lines.push(`  Total Inputs: ${analysis.stats.totalInputs}`);
	lines.push(`  Inputs with labels: ${analysis.stats.inputsWithLabels}`);
	lines.push(`  Inputs without labels: ${analysis.stats.inputsWithoutLabels}`);
	lines.push("");

	if (verbose && analysis.forms.length > 0) {
		lines.push(`${COLORS.bold}Forms Detail:${COLORS.reset}`);
		for (const form of analysis.forms) {
			lines.push(`  Form ${form.index + 1}:`);
			lines.push(`    Action: ${form.action || "(none)"}`);
			lines.push(`    Method: ${form.method || "GET"}`);
			lines.push(`    Submit: ${form.hasSubmit ? "Yes" : "No"}`);
			lines.push(`    Inputs: ${form.inputs.length}`);
		}
		lines.push("");
	}

	if (analysis.issues.length === 0) {
		lines.push(`${COLORS.green}No issues found${COLORS.reset}`);
	} else {
		lines.push(
			`${COLORS.bold}Issues Found: ${analysis.issues.length}${COLORS.reset}`,
		);
		for (const issue of analysis.issues) {
			const color = severityColor(issue.severity);
			const location =
				issue.inputIndex !== undefined
					? `Form ${issue.formIndex + 1}, Input ${issue.inputIndex + 1}`
					: `Form ${issue.formIndex + 1}`;
			lines.push(
				`  ${color}[${issue.severity.toUpperCase().padEnd(7)}]${COLORS.reset} ${issue.message}`,
			);
			lines.push(`    ${COLORS.gray}Location: ${location}${COLORS.reset}`);
			if (issue.details) {
				lines.push(`    ${COLORS.gray}${issue.details}${COLORS.reset}`);
			}
		}
	}

	return lines.join("\n");
}

function showHelp(): void {
	console.log(`
Usage: bun check-forms.ts <url> [options]

Analyze forms for accessibility and UX compliance.

Options:
  -v, --verbose  Show form details
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

		console.log("Parsing forms...");
		const forms = parseForms(html);

		console.log("Analyzing...\n");
		const analysis = analyzeForms(normalizedUrl, forms);

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
