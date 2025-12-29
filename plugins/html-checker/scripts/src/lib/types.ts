export type Severity = "error" | "warning" | "info";

// Headings
export interface HeadingInfo {
	level: number;
	text: string;
	index: number;
	empty: boolean;
	line?: number;
}

export interface HeadingIssue {
	severity: Severity;
	type:
		| "missing-h1"
		| "multiple-h1"
		| "skipped-level"
		| "empty-heading"
		| "wrong-order";
	message: string;
	heading?: HeadingInfo;
	details?: string;
}

export interface HeadingAnalysis {
	url: string;
	headings: HeadingInfo[];
	issues: HeadingIssue[];
	counts: Record<number, number>;
	timestamp: string;
}

// Links
export interface LinkInfo {
	href: string | null;
	text: string;
	index: number;
	element: "a" | "button";
	hasOnclick?: boolean;
	inForm?: boolean;
	type?: string | null;
}

export type LinkIssueType =
	| "empty-href"
	| "javascript-void"
	| "hash-only"
	| "no-text"
	| "button-no-action"
	| "dead-link";

export interface LinkIssue {
	severity: Severity;
	type: LinkIssueType;
	message: string;
	link: LinkInfo;
	details?: string;
}

export interface LinkAnalysis {
	url: string;
	links: LinkInfo[];
	buttons: LinkInfo[];
	issues: LinkIssue[];
	stats: {
		totalLinks: number;
		totalButtons: number;
		emptyHref: number;
		javascriptVoid: number;
		hashOnly: number;
		noText: number;
		buttonNoAction: number;
	};
	timestamp: string;
}

// Images
export interface ImageInfo {
	src: string;
	alt: string | null;
	hasAlt: boolean;
	width: string | null;
	height: string | null;
	loading: string | null;
	index: number;
}

export type ImageIssueType =
	| "missing-alt"
	| "empty-alt"
	| "generic-alt"
	| "long-alt"
	| "missing-dimensions"
	| "no-lazy-loading";

export interface ImageIssue {
	severity: Severity;
	type: ImageIssueType;
	message: string;
	image: ImageInfo;
	details?: string;
}

export interface ImageAnalysis {
	url: string;
	images: ImageInfo[];
	issues: ImageIssue[];
	stats: {
		total: number;
		withAlt: number;
		missingAlt: number;
		emptyAlt: number;
		withDimensions: number;
		withLazyLoading: number;
	};
	timestamp: string;
}

// Meta
export interface MetaInfo {
	title: string | null;
	description: string | null;
	canonical: string | null;
	ogTitle: string | null;
	ogDescription: string | null;
	ogImage: string | null;
	ogUrl: string | null;
	twitterCard: string | null;
	twitterTitle: string | null;
	twitterDescription: string | null;
	twitterImage: string | null;
	robots: string | null;
	viewport: string | null;
}

export type MetaIssueType =
	| "missing-title"
	| "title-too-short"
	| "title-too-long"
	| "missing-description"
	| "description-too-short"
	| "description-too-long"
	| "missing-canonical"
	| "missing-og-title"
	| "missing-og-description"
	| "missing-og-image"
	| "missing-twitter-card";

export interface MetaIssue {
	severity: Severity;
	type: MetaIssueType;
	message: string;
	details?: string;
}

export interface MetaAnalysis {
	url: string;
	meta: MetaInfo;
	issues: MetaIssue[];
	timestamp: string;
}

// Forms
export interface FormInputInfo {
	type: string;
	name: string | null;
	id: string | null;
	hasLabel: boolean;
	labelText: string | null;
	placeholder: string | null;
	required: boolean;
	autocomplete: string | null;
	ariaLabel: string | null;
	index: number;
}

export interface FormInfo {
	action: string | null;
	method: string | null;
	hasSubmit: boolean;
	inputs: FormInputInfo[];
	index: number;
}

export type FormIssueType =
	| "missing-label"
	| "empty-label"
	| "missing-id"
	| "placeholder-as-label"
	| "wrong-input-type"
	| "missing-autocomplete"
	| "no-submit"
	| "missing-action";

export interface FormIssue {
	severity: Severity;
	type: FormIssueType;
	message: string;
	formIndex: number;
	inputIndex?: number;
	details?: string;
}

export interface FormAnalysis {
	url: string;
	forms: FormInfo[];
	issues: FormIssue[];
	stats: {
		totalForms: number;
		totalInputs: number;
		inputsWithLabels: number;
		inputsWithoutLabels: number;
	};
	timestamp: string;
}

// A11y
export interface A11yInfo {
	lang: string | null;
	hasSkipLink: boolean;
	landmarks: {
		main: boolean;
		nav: number;
		header: boolean;
		footer: boolean;
	};
	emptyLinks: number;
	emptyButtons: number;
	focusableHidden: number;
	positiveTabindex: number;
}

export type A11yIssueType =
	| "missing-lang"
	| "missing-skip-link"
	| "missing-main-landmark"
	| "empty-link"
	| "empty-button"
	| "focusable-hidden"
	| "positive-tabindex"
	| "invalid-aria";

export interface A11yIssue {
	severity: Severity;
	type: A11yIssueType;
	wcag: string;
	message: string;
	details?: string;
}

export interface A11yAnalysis {
	url: string;
	info: A11yInfo;
	issues: A11yIssue[];
	score: number;
	timestamp: string;
}

// Performance
export interface ResourceInfo {
	url: string;
	renderBlocking?: boolean;
	hasLazy?: boolean;
	hasDimensions?: boolean;
	isThirdParty?: boolean;
}

export interface PerformanceInfo {
	stylesheets: ResourceInfo[];
	scripts: ResourceInfo[];
	images: ResourceInfo[];
	iframes: ResourceInfo[];
	resourceHints: { rel: string; href: string }[];
	inlineStyles: number;
	inlineScripts: number;
}

export type PerformanceIssueType =
	| "render-blocking-css"
	| "render-blocking-js"
	| "no-lazy-loading"
	| "missing-preconnect"
	| "missing-dimensions"
	| "sync-third-party";

export interface PerformanceIssue {
	severity: Severity;
	type: PerformanceIssueType;
	impact: "high" | "medium" | "low";
	message: string;
	details?: string;
}

export interface PerformanceAnalysis {
	url: string;
	info: PerformanceInfo;
	issues: PerformanceIssue[];
	score: number;
	timestamp: string;
}

export interface CliOptions {
	verbose: boolean;
	json: boolean;
	checkExternal?: boolean;
	level?: "A" | "AA" | "AAA";
}
