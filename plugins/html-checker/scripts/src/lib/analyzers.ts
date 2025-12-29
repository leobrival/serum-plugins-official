import type {
	FormAnalysis,
	FormInfo,
	FormIssue,
	HeadingAnalysis,
	HeadingInfo,
	HeadingIssue,
	ImageAnalysis,
	ImageInfo,
	ImageIssue,
	LinkAnalysis,
	LinkInfo,
	LinkIssue,
	MetaAnalysis,
	MetaInfo,
	MetaIssue,
} from "./types.ts";

const GENERIC_ALT_PATTERNS = [
	/^image$/i,
	/^photo$/i,
	/^picture$/i,
	/^img$/i,
	/^graphic$/i,
	/^icon$/i,
	/^logo$/i,
	/^banner$/i,
	/^untitled$/i,
];

export function analyzeHeadings(
	url: string,
	headings: HeadingInfo[],
): HeadingAnalysis {
	const issues: HeadingIssue[] = [];
	const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

	for (const h of headings) {
		counts[h.level] = (counts[h.level] || 0) + 1;
	}

	if (counts[1] === 0) {
		issues.push({
			severity: "error",
			type: "missing-h1",
			message: "Page has no H1 heading",
			details:
				"Every page should have exactly one H1 that describes the main topic",
		});
	}

	if (counts[1] > 1) {
		issues.push({
			severity: "warning",
			type: "multiple-h1",
			message: `Page has ${counts[1]} H1 headings`,
			details: "Best practice is to have exactly one H1 per page",
		});
	}

	for (const h of headings) {
		if (h.empty) {
			issues.push({
				severity: "error",
				type: "empty-heading",
				message: `Empty H${h.level} heading at position ${h.index + 1}`,
				heading: h,
				details: "Headings should contain descriptive text",
			});
		}
	}

	let previousLevel = 0;
	for (const h of headings) {
		if (previousLevel > 0 && h.level > previousLevel + 1) {
			issues.push({
				severity: "warning",
				type: "skipped-level",
				message: `Skipped from H${previousLevel} to H${h.level}`,
				heading: h,
				details: `Heading "${h.text.substring(0, 50)}${h.text.length > 50 ? "..." : ""}" skips level(s)`,
			});
		}
		previousLevel = h.level;
	}

	return {
		url,
		headings,
		issues,
		counts,
		timestamp: new Date().toISOString(),
	};
}

export function analyzeLinks(
	url: string,
	links: LinkInfo[],
	buttons: LinkInfo[],
): LinkAnalysis {
	const issues: LinkIssue[] = [];
	const stats = {
		totalLinks: links.length,
		totalButtons: buttons.length,
		emptyHref: 0,
		javascriptVoid: 0,
		hashOnly: 0,
		noText: 0,
		buttonNoAction: 0,
	};

	for (const link of links) {
		if (!link.href || link.href === "") {
			stats.emptyHref++;
			issues.push({
				severity: "error",
				type: "empty-href",
				message: `Link with empty href at position ${link.index + 1}`,
				link,
				details: "Links should have a valid destination",
			});
		} else if (link.href.startsWith("javascript:")) {
			stats.javascriptVoid++;
			issues.push({
				severity: "warning",
				type: "javascript-void",
				message: `Link with javascript: href at position ${link.index + 1}`,
				link,
				details: 'Use <button> instead of <a href="javascript:...">',
			});
		} else if (link.href === "#") {
			stats.hashOnly++;
			issues.push({
				severity: "warning",
				type: "hash-only",
				message: `Link with href="#" at position ${link.index + 1}`,
				link,
				details: "Use a proper anchor target or <button> for actions",
			});
		}

		if (!link.text) {
			stats.noText++;
			issues.push({
				severity: "warning",
				type: "no-text",
				message: `Link with no accessible text at position ${link.index + 1}`,
				link,
				details: "Links should have descriptive text or aria-label",
			});
		}
	}

	for (const btn of buttons) {
		const isSubmit = btn.type === "submit";
		const hasAction = btn.hasOnclick || isSubmit;

		if (!hasAction) {
			stats.buttonNoAction++;
			issues.push({
				severity: "warning",
				type: "button-no-action",
				message: `Button without action at position ${btn.index + 1}`,
				link: btn,
				details:
					'Button should have onclick handler or type="submit" in a form',
			});
		}
	}

	return {
		url,
		links,
		buttons,
		issues,
		stats,
		timestamp: new Date().toISOString(),
	};
}

export function analyzeImages(url: string, images: ImageInfo[]): ImageAnalysis {
	const issues: ImageIssue[] = [];
	const stats = {
		total: images.length,
		withAlt: 0,
		missingAlt: 0,
		emptyAlt: 0,
		withDimensions: 0,
		withLazyLoading: 0,
	};

	for (const img of images) {
		if (!img.hasAlt) {
			stats.missingAlt++;
			issues.push({
				severity: "error",
				type: "missing-alt",
				message: `Image missing alt attribute at position ${img.index + 1}`,
				image: img,
				details: "All images must have an alt attribute for accessibility",
			});
		} else if (img.alt === "") {
			stats.emptyAlt++;
			issues.push({
				severity: "warning",
				type: "empty-alt",
				message: `Image with empty alt at position ${img.index + 1}`,
				image: img,
				details:
					"Empty alt is only valid for decorative images. Verify this is intentional.",
			});
		} else if (img.alt) {
			stats.withAlt++;
			const altText = img.alt;

			if (GENERIC_ALT_PATTERNS.some((pattern) => pattern.test(altText))) {
				issues.push({
					severity: "warning",
					type: "generic-alt",
					message: `Image with generic alt "${img.alt}" at position ${img.index + 1}`,
					image: img,
					details: "Alt text should describe the image content specifically",
				});
			}

			if (img.alt.length > 125) {
				issues.push({
					severity: "info",
					type: "long-alt",
					message: `Image with long alt (${img.alt.length} chars) at position ${img.index + 1}`,
					image: img,
					details: "Consider using aria-describedby for detailed descriptions",
				});
			}
		}

		if (img.width && img.height) {
			stats.withDimensions++;
		} else {
			issues.push({
				severity: "warning",
				type: "missing-dimensions",
				message: `Image missing width/height at position ${img.index + 1}`,
				image: img,
				details: "Specify dimensions to prevent Cumulative Layout Shift (CLS)",
			});
		}

		if (img.loading === "lazy") {
			stats.withLazyLoading++;
		}
	}

	return {
		url,
		images,
		issues,
		stats,
		timestamp: new Date().toISOString(),
	};
}

export function analyzeMeta(url: string, meta: MetaInfo): MetaAnalysis {
	const issues: MetaIssue[] = [];

	// Title checks
	if (!meta.title) {
		issues.push({
			severity: "error",
			type: "missing-title",
			message: "Page has no title tag",
			details: "Every page must have a unique, descriptive title",
		});
	} else {
		if (meta.title.length < 30) {
			issues.push({
				severity: "warning",
				type: "title-too-short",
				message: `Title too short (${meta.title.length} chars)`,
				details: "Optimal title length is 30-60 characters",
			});
		}
		if (meta.title.length > 60) {
			issues.push({
				severity: "warning",
				type: "title-too-long",
				message: `Title too long (${meta.title.length} chars)`,
				details: "Title may be truncated in search results (max ~60 chars)",
			});
		}
	}

	// Description checks
	if (!meta.description) {
		issues.push({
			severity: "error",
			type: "missing-description",
			message: "Page has no meta description",
			details: "Meta description is important for SEO and click-through rates",
		});
	} else {
		if (meta.description.length < 50) {
			issues.push({
				severity: "warning",
				type: "description-too-short",
				message: `Description too short (${meta.description.length} chars)`,
				details: "Optimal description length is 50-160 characters",
			});
		}
		if (meta.description.length > 160) {
			issues.push({
				severity: "warning",
				type: "description-too-long",
				message: `Description too long (${meta.description.length} chars)`,
				details:
					"Description may be truncated in search results (max ~160 chars)",
			});
		}
	}

	// Canonical
	if (!meta.canonical) {
		issues.push({
			severity: "warning",
			type: "missing-canonical",
			message: "No canonical URL specified",
			details: "Canonical URL helps prevent duplicate content issues",
		});
	}

	// Open Graph
	if (!meta.ogTitle) {
		issues.push({
			severity: "info",
			type: "missing-og-title",
			message: "Missing og:title",
			details: "Open Graph title improves social media sharing",
		});
	}
	if (!meta.ogDescription) {
		issues.push({
			severity: "info",
			type: "missing-og-description",
			message: "Missing og:description",
			details: "Open Graph description improves social media sharing",
		});
	}
	if (!meta.ogImage) {
		issues.push({
			severity: "info",
			type: "missing-og-image",
			message: "Missing og:image",
			details: "Open Graph image is essential for social media sharing",
		});
	}

	// Twitter
	if (!meta.twitterCard) {
		issues.push({
			severity: "info",
			type: "missing-twitter-card",
			message: "Missing twitter:card",
			details: "Twitter card improves appearance when shared on Twitter/X",
		});
	}

	return {
		url,
		meta,
		issues,
		timestamp: new Date().toISOString(),
	};
}

export function analyzeForms(url: string, forms: FormInfo[]): FormAnalysis {
	const issues: FormIssue[] = [];
	let totalInputs = 0;
	let inputsWithLabels = 0;
	let inputsWithoutLabels = 0;

	const emailFields = ["email", "e-mail", "mail"];
	const phoneFields = ["phone", "tel", "telephone", "mobile"];

	for (const form of forms) {
		if (!form.hasSubmit) {
			issues.push({
				severity: "warning",
				type: "no-submit",
				message: `Form ${form.index + 1} has no submit button`,
				formIndex: form.index,
				details: "Forms should have a clear submit mechanism",
			});
		}

		for (const input of form.inputs) {
			totalInputs++;

			if (input.type === "hidden" || input.type === "submit") {
				continue;
			}

			if (!input.hasLabel) {
				inputsWithoutLabels++;
				if (input.placeholder && !input.ariaLabel) {
					issues.push({
						severity: "warning",
						type: "placeholder-as-label",
						message: `Input "${input.name || input.type}" uses placeholder as label`,
						formIndex: form.index,
						inputIndex: input.index,
						details:
							"Placeholders disappear when typing. Use a visible <label> instead.",
					});
				} else {
					issues.push({
						severity: "error",
						type: "missing-label",
						message: `Input "${input.name || input.type}" has no label`,
						formIndex: form.index,
						inputIndex: input.index,
						details: "All inputs need an associated <label> for accessibility",
					});
				}
			} else {
				inputsWithLabels++;
			}

			// Check input type matches content
			const name = (input.name || "").toLowerCase();
			if (emailFields.some((f) => name.includes(f)) && input.type !== "email") {
				issues.push({
					severity: "warning",
					type: "wrong-input-type",
					message: `Input "${input.name}" should use type="email"`,
					formIndex: form.index,
					inputIndex: input.index,
					details: "Use semantic input types for better UX and validation",
				});
			}
			if (phoneFields.some((f) => name.includes(f)) && input.type !== "tel") {
				issues.push({
					severity: "warning",
					type: "wrong-input-type",
					message: `Input "${input.name}" should use type="tel"`,
					formIndex: form.index,
					inputIndex: input.index,
					details: "Use semantic input types for better mobile keyboard",
				});
			}
		}
	}

	return {
		url,
		forms,
		issues,
		stats: {
			totalForms: forms.length,
			totalInputs,
			inputsWithLabels,
			inputsWithoutLabels,
		},
		timestamp: new Date().toISOString(),
	};
}
