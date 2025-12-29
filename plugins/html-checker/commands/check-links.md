---
description: Analyze and validate links and buttons on a web page
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json]
---

# Check Links Command

Analyze links (`<a>`) and buttons on a web page for proper navigation and accessibility.

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-links <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract links and buttons:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const results = { links: [], buttons: [] };
     document.querySelectorAll('a').forEach((a, i) => {
       results.links.push({
         href: a.getAttribute('href'),
         text: a.textContent.trim() || a.getAttribute('aria-label') || '',
         index: i
       });
     });
     document.querySelectorAll('button').forEach((btn, i) => {
       results.buttons.push({
         text: btn.textContent.trim(),
         hasOnclick: btn.hasAttribute('onclick'),
         type: btn.getAttribute('type'),
         index: i
       });
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

3. Extract links and buttons:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const results = { links: [], buttons: [] };
     document.querySelectorAll('a').forEach((a, i) => {
       results.links.push({
         href: a.getAttribute('href'),
         text: a.textContent.trim() || a.getAttribute('aria-label') || '',
         index: i
       });
     });
     document.querySelectorAll('button').forEach((btn, i) => {
       results.buttons.push({
         text: btn.textContent.trim(),
         hasOnclick: btn.hasAttribute('onclick'),
         type: btn.getAttribute('type'),
         index: i
       });
     });
     return JSON.stringify(results);
   })()
   ```

4. Analyze and report results

## Validation Rules

- Links have valid href attributes (not empty)
- No javascript:void(0) links
- No hash-only (#) links without destination
- Buttons have proper actions (onclick or type="submit")
- Links have accessible text or aria-label

## Output Format

```
Link Analysis for <URL>

Summary:
  Total Links: X
  Total Buttons: X
  Issues Found: X

Issues:
  [SEVERITY] Type at position X

Statistics:
  Empty href: X
  javascript:void: X
  Hash-only: X
  No text: X
```

## Severity Levels

- **ERROR**: Empty href, buttons without action
- **WARNING**: javascript:void, hash-only links, missing text
- **INFO**: Informational notes
