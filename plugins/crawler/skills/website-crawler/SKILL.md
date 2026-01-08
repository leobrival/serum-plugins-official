---
name: website-crawler
description: High-performance web crawler for discovering and mapping website structure. Use when users ask to crawl a website, map site structure, discover pages, find all URLs on a site, analyze link relationships, or generate site reports. Supports sitemap discovery, checkpoint/resume, rate limiting, and HTML report generation.
---

# Website Crawler

High-performance web crawler with TypeScript/Bun frontend and Go backend for discovering and mapping website structure.

## When to Use

Use this skill when users ask to:
- **Crawl a website** or "spider a site"
- **Map site structure** or "discover all pages"
- **Find all URLs** on a website
- **Generate sitemap** or site report
- **Analyze link relationships** between pages
- **Audit website coverage** or completeness
- **Extract page metadata** (titles, status codes)

Keywords: crawl, spider, map, discover pages, site structure, sitemap, all URLs, website audit

## Quick Start

Run the crawler from the scripts directory:

```bash
cd ~/.claude/scripts/crawler
bun src/index.ts <URL> [options]
```

## CLI Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--depth` | `-D` | 2 | Maximum crawl depth |
| `--workers` | `-w` | 20 | Concurrent workers |
| `--rate` | `-r` | 2 | Rate limit (requests/second) |
| `--profile` | `-p` | - | Use preset profile (fast/deep/gentle) |
| `--output` | `-o` | auto | Output directory |
| `--sitemap` | `-s` | true | Use sitemap.xml for discovery |
| `--domain` | `-d` | auto | Allowed domain (extracted from URL) |
| `--debug` | - | false | Enable debug logging |

## Profiles

Three preset profiles for common use cases:

| Profile | Workers | Depth | Rate | Use Case |
|---------|---------|-------|------|----------|
| `fast` | 50 | 3 | 10 | Quick site mapping |
| `deep` | 20 | 10 | 3 | Thorough crawling |
| `gentle` | 5 | 5 | 1 | Respect server limits |

## Usage Examples

### Basic crawl

```bash
bun src/index.ts https://example.com
```

### Deep crawl with high concurrency

```bash
bun src/index.ts https://example.com --depth 5 --workers 30 --rate 5
```

### Using a profile

```bash
bun src/index.ts https://example.com --profile fast
```

### Gentle crawl (avoid rate limiting)

```bash
bun src/index.ts https://example.com --profile gentle
```

## Output

The crawler generates two files in the output directory:

1. **results.json** - Structured crawl data with all discovered pages
2. **index.html** - Dark-themed HTML report with statistics

### Results JSON Structure

```json
{
  "stats": {
    "pages_found": 150,
    "pages_crawled": 147,
    "external_links": 23,
    "errors": 3,
    "duration": 45.2
  },
  "results": [
    {
      "url": "https://example.com/page",
      "title": "Page Title",
      "status_code": 200,
      "depth": 1,
      "links": ["..."],
      "content_type": "text/html"
    }
  ]
}
```

## Features

- **Sitemap Discovery**: Automatically finds and parses sitemap.xml
- **Checkpoint/Resume**: Auto-saves progress every 30 seconds
- **Rate Limiting**: Token bucket algorithm prevents server overload
- **Concurrent Crawling**: Go worker pool for high performance
- **HTML Reports**: Dark-themed, mobile-responsive reports

## Troubleshooting

### Rate limiting errors

Reduce the rate limit or use the gentle profile:

```bash
bun src/index.ts <url> --rate 1
# or
bun src/index.ts <url> --profile gentle
```

### Go binary not found

The TypeScript frontend auto-compiles the Go binary. If compilation fails:

```bash
cd ~/.claude/scripts/crawler/engine
go build -o crawler main.go
```

### Timeout on large sites

Reduce depth or increase workers:

```bash
bun src/index.ts <url> --depth 1 --workers 50
```

## Architecture

For detailed architecture, Go engine specifications, and code conventions, see [reference.md](reference.md).

## Related Files

- **Command**: `plugins/crawler/commands/crawler.md`
- **Reference**: `plugins/crawler/skills/website-crawler/reference.md`
- **Scripts**: `plugins/crawler/skills/website-crawler/scripts/`
- **Profiles**: `plugins/crawler/skills/website-crawler/scripts/config/profiles/`
