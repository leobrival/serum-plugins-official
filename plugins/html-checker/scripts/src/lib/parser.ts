import type {
	FormInfo,
	FormInputInfo,
	HeadingInfo,
	ImageInfo,
	LinkInfo,
	MetaInfo,
} from "./types.ts";

const HEADING_REGEX = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi;
const LINK_REGEX = /<a([^>]*)>([\s\S]*?)<\/a>/gi;
const BUTTON_REGEX = /<button([^>]*)>([\s\S]*?)<\/button>/gi;
const IMAGE_REGEX = /<img([^>]*)>/gi;
const FORM_REGEX = /<form([^>]*)>([\s\S]*?)<\/form>/gi;
const INPUT_REGEX =
	/<(?:input|select|textarea)([^>]*)(?:>[\s\S]*?<\/(?:select|textarea)>|\/?>)/gi;
const LABEL_REGEX = /<label([^>]*)>([\s\S]*?)<\/label>/gi;

const HREF_REGEX = /href\s*=\s*["']([^"']*)["']/i;
const SRC_REGEX = /src\s*=\s*["']([^"']*)["']/i;
const ALT_REGEX = /alt\s*=\s*["']([^"']*)["']/i;
const ARIA_LABEL_REGEX = /aria-label\s*=\s*["']([^"']*)["']/i;
const ONCLICK_REGEX = /onclick\s*=/i;
const TYPE_REGEX = /type\s*=\s*["']([^"']*)["']/i;
const ID_REGEX = /id\s*=\s*["']([^"']*)["']/i;
const NAME_REGEX = /name\s*=\s*["']([^"']*)["']/i;
const FOR_REGEX = /for\s*=\s*["']([^"']*)["']/i;
const WIDTH_REGEX = /width\s*=\s*["']([^"']*)["']/i;
const HEIGHT_REGEX = /height\s*=\s*["']([^"']*)["']/i;
const LOADING_REGEX = /loading\s*=\s*["']([^"']*)["']/i;
const AUTOCOMPLETE_REGEX = /autocomplete\s*=\s*["']([^"']*)["']/i;
const PLACEHOLDER_REGEX = /placeholder\s*=\s*["']([^"']*)["']/i;
const ACTION_REGEX = /action\s*=\s*["']([^"']*)["']/i;
const METHOD_REGEX = /method\s*=\s*["']([^"']*)["']/i;

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

function getAttr(attrs: string, regex: RegExp): string | null {
	const match = regex.exec(attrs);
	return match ? match[1] : null;
}

function hasAttr(attrs: string, name: string): boolean {
	return new RegExp(`${name}(?:\\s*=|\\s|>|$)`, "i").test(attrs);
}

export function parseHeadings(html: string): HeadingInfo[] {
	const headings: HeadingInfo[] = [];
	let index = 0;

	for (const match of html.matchAll(HEADING_REGEX)) {
		const level = Number.parseInt(match[1], 10);
		const text = stripHtml(match[3]);

		headings.push({
			level,
			text,
			index,
			empty: text.length === 0,
		});
		index++;
	}

	return headings;
}

export function parseLinks(html: string): LinkInfo[] {
	const links: LinkInfo[] = [];
	let index = 0;

	for (const match of html.matchAll(LINK_REGEX)) {
		const attrs = match[1];
		const content = match[2];

		const text = stripHtml(content) || getAttr(attrs, ARIA_LABEL_REGEX) || "";
		const href = getAttr(attrs, HREF_REGEX);

		links.push({
			href,
			text,
			index,
			element: "a",
		});
		index++;
	}

	return links;
}

export function parseButtons(html: string): LinkInfo[] {
	const buttons: LinkInfo[] = [];
	let index = 0;

	for (const match of html.matchAll(BUTTON_REGEX)) {
		const attrs = match[1];
		const content = match[2];

		const hasOnclick = ONCLICK_REGEX.test(attrs);
		const type = getAttr(attrs, TYPE_REGEX);

		buttons.push({
			href: null,
			text: stripHtml(content),
			index,
			element: "button",
			hasOnclick,
			type,
		});
		index++;
	}

	return buttons;
}

export function parseImages(html: string): ImageInfo[] {
	const images: ImageInfo[] = [];
	let index = 0;

	for (const match of html.matchAll(IMAGE_REGEX)) {
		const attrs = match[1];

		images.push({
			src: getAttr(attrs, SRC_REGEX) || "",
			alt: getAttr(attrs, ALT_REGEX),
			hasAlt: hasAttr(attrs, "alt"),
			width: getAttr(attrs, WIDTH_REGEX),
			height: getAttr(attrs, HEIGHT_REGEX),
			loading: getAttr(attrs, LOADING_REGEX),
			index,
		});
		index++;
	}

	return images;
}

export function parseMeta(html: string): MetaInfo {
	const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
	const title = titleMatch ? stripHtml(titleMatch[1]) : null;

	const getMeta = (name: string): string | null => {
		const nameRegex = new RegExp(
			`<meta[^>]*(?:name|property)\\s*=\\s*["']${name}["'][^>]*content\\s*=\\s*["']([^"']*)["']`,
			"i",
		);
		const contentRegex = new RegExp(
			`<meta[^>]*content\\s*=\\s*["']([^"']*)["'][^>]*(?:name|property)\\s*=\\s*["']${name}["']`,
			"i",
		);
		const match = nameRegex.exec(html) || contentRegex.exec(html);
		return match ? match[1] : null;
	};

	const canonicalMatch =
		/<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']*)["']/i.exec(
			html,
		) ||
		/<link[^>]*href\s*=\s*["']([^"']*)["'][^>]*rel\s*=\s*["']canonical["']/i.exec(
			html,
		);

	return {
		title,
		description: getMeta("description"),
		canonical: canonicalMatch ? canonicalMatch[1] : null,
		ogTitle: getMeta("og:title"),
		ogDescription: getMeta("og:description"),
		ogImage: getMeta("og:image"),
		ogUrl: getMeta("og:url"),
		twitterCard: getMeta("twitter:card"),
		twitterTitle: getMeta("twitter:title"),
		twitterDescription: getMeta("twitter:description"),
		twitterImage: getMeta("twitter:image"),
		robots: getMeta("robots"),
		viewport: getMeta("viewport"),
	};
}

export function parseForms(html: string): FormInfo[] {
	const forms: FormInfo[] = [];
	let formIndex = 0;

	// Build label map
	const labelMap = new Map<string, string>();
	for (const labelMatch of html.matchAll(LABEL_REGEX)) {
		const forId = getAttr(labelMatch[1], FOR_REGEX);
		if (forId) {
			labelMap.set(forId, stripHtml(labelMatch[2]));
		}
	}

	for (const formMatch of html.matchAll(FORM_REGEX)) {
		const formAttrs = formMatch[1];
		const formContent = formMatch[2];

		const inputs: FormInputInfo[] = [];
		let inputIndex = 0;

		for (const inputMatch of formContent.matchAll(INPUT_REGEX)) {
			const attrs = inputMatch[1];
			const id = getAttr(attrs, ID_REGEX);
			const labelText = id ? labelMap.get(id) || null : null;

			inputs.push({
				type: getAttr(attrs, TYPE_REGEX) || "text",
				name: getAttr(attrs, NAME_REGEX),
				id,
				hasLabel: !!labelText || hasAttr(attrs, "aria-label"),
				labelText,
				placeholder: getAttr(attrs, PLACEHOLDER_REGEX),
				required: hasAttr(attrs, "required"),
				autocomplete: getAttr(attrs, AUTOCOMPLETE_REGEX),
				ariaLabel: getAttr(attrs, ARIA_LABEL_REGEX),
				index: inputIndex,
			});
			inputIndex++;
		}

		const hasSubmit =
			/<(?:input[^>]*type\s*=\s*["']submit["']|button(?![^>]*type\s*=\s*["']button["']))/.test(
				formContent,
			);

		forms.push({
			action: getAttr(formAttrs, ACTION_REGEX),
			method: getAttr(formAttrs, METHOD_REGEX),
			hasSubmit,
			inputs,
			index: formIndex,
		});
		formIndex++;
	}

	return forms;
}
