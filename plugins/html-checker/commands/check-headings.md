---
description: Analyze and validate HTML heading hierarchy (H1-H6) on a web page
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json]
---

# Check Headings Command

Analyze the heading structure (H1-H6) of a web page for SEO and accessibility compliance.

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-headings <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract headings:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const headings = [];
     document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h, i) => {
       headings.push({
         level: parseInt(h.tagName[1], 10),
         text: h.textContent.trim(),
         index: i,
         empty: !h.textContent.trim()
       });
     });
     return headings;
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

3. Extract headings:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const headings = [];
     document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h, i) => {
       headings.push({
         level: parseInt(h.tagName[1], 10),
         text: h.textContent.trim(),
         index: i,
         empty: !h.textContent.trim()
       });
     });
     return JSON.stringify(headings);
   })()
   ```

4. Analyze and report results

## Validation Rules

- Presence of exactly one H1
- Sequential heading levels (no skipping H2 to H4)
- Non-empty heading content
- Proper nesting structure

## Output Format

```
Heading Analysis for <URL>

Summary:
  H1: X  H2: X  H3: X  H4: X  H5: X  H6: X

Issues Found: X
  [SEVERITY] Description at position X

Hierarchy:
  H1: Title
    H2: Section
      H3: Subsection
```

## Severity Levels

- **ERROR**: Missing H1, empty headings
- **WARNING**: Multiple H1, skipped levels
- **INFO**: Informational notes
