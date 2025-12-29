---
description: Full site HTML audit - crawl all pages then check headings and links
allowed-tools: [Bash, Read, Write]
argument-hint: <url> [--depth N] [--limit N]
---

# Site Audit Command

Perform a full HTML audit of an entire website by combining the crawler with heading and link checks.

$ARGUMENTS

## Context

You are helping the user perform a comprehensive HTML audit of a website. This combines:

1. **Crawler** - Discover all pages on the site
2. **Check Headings** - Analyze H1-H6 structure on each page
3. **Check Links** - Validate links and buttons on each page

## Workflow

### Step 1: Crawl the website

Run the crawler to discover all pages:

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/crawler/skills/website-crawler/scripts
bun src/index.ts <url> --depth <depth> --profile gentle
```

The crawler outputs `results.json` containing all discovered URLs.

### Step 2: Parse crawl results

Read the `results.json` file to extract the list of URLs:

```bash
cat <output_dir>/results.json | jq -r '.results[].url'
```

### Step 3: Run HTML checks on each page

For each discovered URL, run both checks:

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts

# Check headings
bun src/check-headings.ts <page_url> --json

# Check links
bun src/check-links.ts <page_url> --json
```

### Step 4: Aggregate results

Compile all issues into a summary report:

- Total pages analyzed
- Pages with heading issues
- Pages with link issues
- Most common issues
- Priority fixes

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--depth` | 2 | Crawl depth for page discovery |
| `--limit` | 50 | Maximum pages to analyze |

## Output Format

```
Site Audit Report for <URL>
===========================

Crawl Summary:
  Pages discovered: X
  Pages analyzed: X

Heading Issues:
  Total: X issues across Y pages
  - Missing H1: X pages
  - Multiple H1: X pages
  - Skipped levels: X occurrences
  - Empty headings: X occurrences

Link Issues:
  Total: X issues across Y pages
  - Empty href: X occurrences
  - javascript:void: X occurrences
  - Hash-only links: X occurrences
  - Missing text: X occurrences

Priority Fixes:
  1. [ERROR] <url> - Missing H1
  2. [ERROR] <url> - Empty href links
  ...

Detailed Results:
  [Page-by-page breakdown]
```

## Examples

User: "Audit example.com"
-> Crawl with depth 2, analyze up to 50 pages, report all issues

User: "Full audit of my-site.com --depth 3 --limit 100"
-> Deep crawl, analyze up to 100 pages

User: "Quick audit of blog.com --depth 1 --limit 10"
-> Shallow crawl, sample 10 pages

## Response

1. Start the crawler and show progress
2. Parse results and count pages
3. Run checks on each page (show progress)
4. Generate summary report with actionable recommendations
5. Highlight critical issues first
