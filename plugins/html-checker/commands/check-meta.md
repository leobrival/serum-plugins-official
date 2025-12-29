---
description: Analyze meta tags for SEO and social sharing
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json]
---

# Check Meta Command

Analyze meta tags for SEO optimization and social media sharing.

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-meta <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract meta information:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const getMeta = (name) => {
       const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
       return el ? el.getAttribute('content') : null;
     };
     return {
       title: document.title,
       description: getMeta('description'),
       canonical: document.querySelector('link[rel="canonical"]')?.href || null,
       ogTitle: getMeta('og:title'),
       ogDescription: getMeta('og:description'),
       ogImage: getMeta('og:image'),
       ogUrl: getMeta('og:url'),
       twitterCard: getMeta('twitter:card'),
       twitterTitle: getMeta('twitter:title'),
       twitterDescription: getMeta('twitter:description'),
       twitterImage: getMeta('twitter:image'),
       robots: getMeta('robots'),
       viewport: getMeta('viewport')
     };
   }
   ```

3. Analyze and report results

### Level 3: Claude in Chrome MCP

If Chrome DevTools fails, use Claude in Chrome:

1. Get tab context:
   ```
   mcp__claude-in-chrome__tabs_context_mcp with createIfEmpty: true
   ```

2. Navigate to page:
   ```
   mcp__claude-in-chrome__navigate with url: <url>, tabId: <tabId>
   ```

3. Extract meta information:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const getMeta = (name) => {
       const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
       return el ? el.getAttribute('content') : null;
     };
     return JSON.stringify({
       title: document.title,
       description: getMeta('description'),
       canonical: document.querySelector('link[rel="canonical"]')?.href || null,
       ogTitle: getMeta('og:title'),
       ogDescription: getMeta('og:description'),
       ogImage: getMeta('og:image'),
       ogUrl: getMeta('og:url'),
       twitterCard: getMeta('twitter:card'),
       twitterTitle: getMeta('twitter:title'),
       twitterDescription: getMeta('twitter:description'),
       twitterImage: getMeta('twitter:image'),
       robots: getMeta('robots'),
       viewport: getMeta('viewport')
     });
   })()
   ```

4. Analyze and report results

## Validation Rules

- Title tag presence and length (30-60 chars optimal)
- Meta description presence and length (50-160 chars optimal)
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)

## Output Format

```
Meta Analysis for <URL>

SEO Tags:
  [OK/MISSING] title: <value> (X chars)
  [OK/MISSING] description: <value> (X chars)
  [OK/MISSING] canonical: <value>

Open Graph:
  [OK/MISSING] og:title
  [OK/MISSING] og:description
  [OK/MISSING] og:image

Twitter Card:
  [OK/MISSING] twitter:card

Issues Found: X
```

## Severity Levels

- **ERROR**: Missing title, missing description
- **WARNING**: Title/description too short/long, missing canonical
- **INFO**: Missing OG tags, missing Twitter tags
