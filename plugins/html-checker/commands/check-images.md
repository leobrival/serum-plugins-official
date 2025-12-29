---
description: Analyze image accessibility and optimization on a web page
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json]
---

# Check Images Command

Analyze images for accessibility (alt attributes) and optimization (dimensions, lazy loading).

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-images <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract images:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const images = [];
     document.querySelectorAll('img').forEach((img, i) => {
       images.push({
         src: img.src,
         alt: img.getAttribute('alt'),
         hasAlt: img.hasAttribute('alt'),
         width: img.getAttribute('width'),
         height: img.getAttribute('height'),
         loading: img.getAttribute('loading'),
         index: i
       });
     });
     return images;
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

3. Extract images:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const images = [];
     document.querySelectorAll('img').forEach((img, i) => {
       images.push({
         src: img.src,
         alt: img.getAttribute('alt'),
         hasAlt: img.hasAttribute('alt'),
         width: img.getAttribute('width'),
         height: img.getAttribute('height'),
         loading: img.getAttribute('loading'),
         index: i
       });
     });
     return JSON.stringify(images);
   })()
   ```

4. Analyze and report results

## Validation Rules

- All images have alt attributes
- Alt text is descriptive (not generic like "image", "photo")
- Alt text length is reasonable (< 125 chars)
- Images have width/height to prevent CLS
- Lazy loading is used appropriately

## Output Format

```
Image Analysis for <URL>

Summary:
  Total Images: X
  With alt: X
  Missing alt: X
  Empty alt: X
  With dimensions: X
  With lazy loading: X

Issues:
  [SEVERITY] Description at position X
```

## Severity Levels

- **ERROR**: Missing alt attribute
- **WARNING**: Empty alt, generic alt, missing dimensions
- **INFO**: Missing lazy loading, long alt text
