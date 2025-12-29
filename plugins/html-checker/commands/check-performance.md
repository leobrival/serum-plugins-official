---
description: Analyze performance-related HTML patterns
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json]
---

# Check Performance Command

Analyze HTML for performance optimization opportunities.

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-performance <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract performance information:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const results = {
       stylesheets: [],
       scripts: [],
       images: [],
       iframes: [],
       resourceHints: [],
       inlineStyles: document.querySelectorAll('style').length,
       inlineScripts: document.querySelectorAll('script:not([src])').length
     };
     document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
       results.stylesheets.push({
         href: link.href,
         media: link.media,
         renderBlocking: !link.media || link.media === 'all'
       });
     });
     document.querySelectorAll('script[src]').forEach(script => {
       results.scripts.push({
         src: script.src,
         async: script.async,
         defer: script.defer,
         renderBlocking: !script.async && !script.defer,
         isThirdParty: !script.src.includes(location.hostname)
       });
     });
     document.querySelectorAll('img').forEach(img => {
       results.images.push({
         src: img.src,
         hasLazy: img.loading === 'lazy',
         hasDimensions: !!(img.width && img.height)
       });
     });
     document.querySelectorAll('iframe').forEach(iframe => {
       results.iframes.push({
         src: iframe.src,
         hasLazy: iframe.loading === 'lazy'
       });
     });
     document.querySelectorAll('link[rel="preconnect"], link[rel="preload"], link[rel="dns-prefetch"]').forEach(link => {
       results.resourceHints.push({ rel: link.rel, href: link.href });
     });
     return results;
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

3. Extract performance information:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const results = {
       stylesheets: [],
       scripts: [],
       images: [],
       iframes: [],
       resourceHints: [],
       inlineStyles: document.querySelectorAll('style').length,
       inlineScripts: document.querySelectorAll('script:not([src])').length
     };
     document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
       results.stylesheets.push({
         href: link.href,
         renderBlocking: !link.media || link.media === 'all'
       });
     });
     document.querySelectorAll('script[src]').forEach(script => {
       results.scripts.push({
         src: script.src,
         renderBlocking: !script.async && !script.defer,
         isThirdParty: !script.src.includes(location.hostname)
       });
     });
     document.querySelectorAll('img').forEach(img => {
       results.images.push({
         hasLazy: img.loading === 'lazy',
         hasDimensions: !!(img.width && img.height)
       });
     });
     document.querySelectorAll('iframe').forEach(iframe => {
       results.iframes.push({ hasLazy: iframe.loading === 'lazy' });
     });
     document.querySelectorAll('link[rel="preconnect"], link[rel="preload"], link[rel="dns-prefetch"]').forEach(link => {
       results.resourceHints.push({ rel: link.rel, href: link.href });
     });
     return JSON.stringify(results);
   })()
   ```

4. Analyze and report results

## Analysis Points

- Render-blocking CSS (stylesheets without media queries)
- Render-blocking JavaScript (scripts without async/defer)
- Third-party synchronous scripts
- Images without lazy loading
- Images without dimensions (CLS impact)
- Iframes without lazy loading
- Resource hints (preconnect, preload, dns-prefetch)

## Output Format

```
Performance Analysis for <URL>

Resource Summary:
  Stylesheets: X (Y render-blocking)
  Scripts: X (Y render-blocking)
  Images: X (Y lazy-loaded)
  Iframes: X (Y lazy-loaded)
  Inline styles: X
  Inline scripts: X

Resource Hints:
  [preconnect] href
  [preload] href

Issues Found: X
  [IMPACT] Description

Score: XX/100
```

## Impact Levels

- **HIGH**: Render-blocking CSS/JS, sync third-party scripts
- **MEDIUM**: Missing lazy loading, no image dimensions
- **LOW**: Missing resource hints
