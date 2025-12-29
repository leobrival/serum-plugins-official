---
description: Accessibility audit for WCAG 2.1 compliance
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json] [--level <A|AA|AAA>]
---

# Check Accessibility Command

Perform accessibility audit for WCAG 2.1 compliance.

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-a11y <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract accessibility information:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const results = {
       lang: document.documentElement.lang,
       hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"], .skip-link'),
       landmarks: {
         main: !!document.querySelector('main, [role="main"]'),
         nav: document.querySelectorAll('nav, [role="navigation"]').length,
         header: !!document.querySelector('header, [role="banner"]'),
         footer: !!document.querySelector('footer, [role="contentinfo"]')
       },
       emptyLinks: 0,
       emptyButtons: 0,
       focusableHidden: 0,
       positiveTabindex: 0
     };
     document.querySelectorAll('a').forEach(a => {
       const text = a.textContent?.trim() || a.getAttribute('aria-label') || a.querySelector('img')?.alt;
       if (!text) results.emptyLinks++;
     });
     document.querySelectorAll('button').forEach(btn => {
       const text = btn.textContent?.trim() || btn.getAttribute('aria-label');
       if (!text) results.emptyButtons++;
     });
     document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
       if (el.querySelector('a, button, input, select, textarea, [tabindex]')) results.focusableHidden++;
     });
     document.querySelectorAll('[tabindex]').forEach(el => {
       if (parseInt(el.getAttribute('tabindex'), 10) > 0) results.positiveTabindex++;
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

3. Extract accessibility information:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const results = {
       lang: document.documentElement.lang,
       hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"], .skip-link'),
       landmarks: {
         main: !!document.querySelector('main, [role="main"]'),
         nav: document.querySelectorAll('nav, [role="navigation"]').length,
         header: !!document.querySelector('header, [role="banner"]'),
         footer: !!document.querySelector('footer, [role="contentinfo"]')
       },
       emptyLinks: 0,
       emptyButtons: 0,
       focusableHidden: 0,
       positiveTabindex: 0
     };
     document.querySelectorAll('a').forEach(a => {
       const text = a.textContent?.trim() || a.getAttribute('aria-label') || a.querySelector('img')?.alt;
       if (!text) results.emptyLinks++;
     });
     document.querySelectorAll('button').forEach(btn => {
       const text = btn.textContent?.trim() || btn.getAttribute('aria-label');
       if (!text) results.emptyButtons++;
     });
     document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
       if (el.querySelector('a, button, input, select, textarea, [tabindex]')) results.focusableHidden++;
     });
     document.querySelectorAll('[tabindex]').forEach(el => {
       if (parseInt(el.getAttribute('tabindex'), 10) > 0) results.positiveTabindex++;
     });
     return JSON.stringify(results);
   })()
   ```

4. Analyze and report results

## Validation Rules (WCAG 2.1)

- Language attribute on `<html>` (WCAG 3.1.1)
- Skip navigation link (WCAG 2.4.1)
- Landmark regions (main, nav, header, footer) (WCAG 1.3.1)
- Empty links and buttons (WCAG 2.4.4, 4.1.2)
- Focusable elements in aria-hidden (WCAG 4.1.2)
- Positive tabindex values (WCAG 2.4.3)

## Output Format

```
Accessibility Audit for <URL>
WCAG Level: AA

Page Structure:
  Language: [OK/MISSING] lang="en"
  Skip link: [OK/MISSING]

Landmarks:
  <main>: [OK/MISSING]
  <nav>: X found
  <header>: [OK/MISSING]
  <footer>: [OK/MISSING]

Issues Found: X
  [SEVERITY] Description
    WCAG X.X.X

Score: XX/100
```

## Severity Levels

- **ERROR**: Missing lang, empty links/buttons, focusable in aria-hidden
- **WARNING**: Missing skip link, no landmarks, positive tabindex
- **INFO**: Missing optional landmarks
