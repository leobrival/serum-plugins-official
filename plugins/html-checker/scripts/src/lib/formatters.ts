import type { HeadingAnalysis, LinkAnalysis, Severity } from "./types.ts";

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

function severityLabel(severity: Severity): string {
	return severity.toUpperCase().padEnd(7);
}

export function formatHeadingAnalysis(
	analysis: HeadingAnalysis,
	verbose: boolean,
): string {
	const lines: string[] = [];

	lines.push(
		`${COLORS.bold}Heading Analysis for ${analysis.url}${COLORS.reset}`,
	);
	lines.push("");

	// Summary
	lines.push(`${COLORS.bold}Summary:${COLORS.reset}`);
	const counts = Object.entries(analysis.counts)
		.map(([level, count]) => `H${level}: ${count}`)
		.join("  ");
	lines.push(`  ${counts}`);
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
				`  ${color}[${severityLabel(issue.severity)}]${COLORS.reset} ${issue.message}`,
			);
			if (issue.details) {
				lines.push(`    ${COLORS.gray}${issue.details}${COLORS.reset}`);
			}
		}
	}
	lines.push("");

	// Hierarchy (visual tree)
	if (verbose && analysis.headings.length > 0) {
		lines.push(`${COLORS.bold}Hierarchy:${COLORS.reset}`);
		for (const h of analysis.headings) {
			const indent = "  ".repeat(h.level);
			const text =
				h.text.length > 60 ? `${h.text.substring(0, 57)}...` : h.text;
			const empty = h.empty ? ` ${COLORS.red}[EMPTY]${COLORS.reset}` : "";
			lines.push(`${indent}H${h.level}: ${text}${empty}`);
		}
		lines.push("");
	}

	// Recommendations
	if (analysis.issues.length > 0) {
		lines.push(`${COLORS.bold}Recommendations:${COLORS.reset}`);
		const hasMultipleH1 = analysis.issues.some((i) => i.type === "multiple-h1");
		const hasMissingH1 = analysis.issues.some((i) => i.type === "missing-h1");
		const hasSkipped = analysis.issues.some((i) => i.type === "skipped-level");
		const hasEmpty = analysis.issues.some((i) => i.type === "empty-heading");

		if (hasMissingH1) {
			lines.push("  - Add an H1 heading that describes the main page topic");
		}
		if (hasMultipleH1) {
			lines.push("  - Keep only one H1 per page; demote others to H2 or lower");
		}
		if (hasSkipped) {
			lines.push(
				"  - Fix heading hierarchy to use sequential levels (H1 -> H2 -> H3)",
			);
		}
		if (hasEmpty) {
			lines.push("  - Add descriptive text to empty headings or remove them");
		}
	}

	return lines.join("\n");
}

export function formatLinkAnalysis(
	analysis: LinkAnalysis,
	verbose: boolean,
): string {
	const lines: string[] = [];

	lines.push(`${COLORS.bold}Link Analysis for ${analysis.url}${COLORS.reset}`);
	lines.push("");

	// Summary
	lines.push(`${COLORS.bold}Summary:${COLORS.reset}`);
	lines.push(`  Total Links: ${analysis.stats.totalLinks}`);
	lines.push(`  Total Buttons: ${analysis.stats.totalButtons}`);
	lines.push(`  Issues Found: ${analysis.issues.length}`);
	lines.push("");

	// Issues
	if (analysis.issues.length === 0) {
		lines.push(`${COLORS.green}No issues found${COLORS.reset}`);
	} else {
		lines.push(`${COLORS.bold}Issues:${COLORS.reset}`);
		for (const issue of analysis.issues) {
			const color = severityColor(issue.severity);
			lines.push(
				`  ${color}[${severityLabel(issue.severity)}]${COLORS.reset} ${issue.message}`,
			);
			if (verbose && issue.link) {
				const href = issue.link.href ? `href="${issue.link.href}"` : "no href";
				const text = issue.link.text
					? `"${issue.link.text.substring(0, 30)}${issue.link.text.length > 30 ? "..." : ""}"`
					: "no text";
				lines.push(
					`    ${COLORS.gray}<${issue.link.element} ${href}>${text}</${issue.link.element}>${COLORS.reset}`,
				);
			}
			if (issue.details) {
				lines.push(`    ${COLORS.gray}${issue.details}${COLORS.reset}`);
			}
		}
	}
	lines.push("");

	// Statistics
	lines.push(`${COLORS.bold}Statistics:${COLORS.reset}`);
	lines.push(`  Empty href: ${analysis.stats.emptyHref}`);
	lines.push(`  javascript:void: ${analysis.stats.javascriptVoid}`);
	lines.push(`  Hash-only: ${analysis.stats.hashOnly}`);
	lines.push(`  No text: ${analysis.stats.noText}`);
	lines.push(`  Button no action: ${analysis.stats.buttonNoAction}`);
	lines.push("");

	// Recommendations
	if (analysis.issues.length > 0) {
		lines.push(`${COLORS.bold}Recommendations:${COLORS.reset}`);

		if (analysis.stats.emptyHref > 0) {
			lines.push("  - Add valid href attributes or convert to <button>");
		}
		if (analysis.stats.javascriptVoid > 0) {
			lines.push("  - Replace javascript:void links with <button> elements");
		}
		if (analysis.stats.hashOnly > 0) {
			lines.push('  - Use proper anchor targets or <button> for "#" links');
		}
		if (analysis.stats.noText > 0) {
			lines.push("  - Add accessible text or aria-label to empty links");
		}
		if (analysis.stats.buttonNoAction > 0) {
			lines.push("  - Ensure buttons have onclick handlers or are in forms");
		}
	}

	return lines.join("\n");
}
