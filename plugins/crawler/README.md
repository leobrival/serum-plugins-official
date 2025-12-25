# Crawler Plugin

High-performance web crawler for discovering and mapping website structure.

## Features

- Sitemap discovery and parsing
- Checkpoint/resume support
- Rate limiting
- HTML report generation

## Commands

| Command | Description |
|---------|-------------|
| `/crawler` | Crawl a website and generate a site map |

## Usage

```bash
/crawler https://example.com
```

## Scripts

The crawler uses a Go backend for high performance. Scripts are symlinked from `~/.claude/scripts/crawler`.
