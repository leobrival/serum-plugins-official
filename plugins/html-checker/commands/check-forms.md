---
description: Analyze form accessibility and usability
allowed-tools: [Bash, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__evaluate_script, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__javascript_tool, mcp__claude-in-chrome__tabs_context_mcp]
argument-hint: <url> [--verbose] [--json]
---

# Check Forms Command

Analyze forms for accessibility compliance and usability best practices.

$ARGUMENTS

## Execution Strategy (3 Fallback Levels)

Try each method in order. If one fails, proceed to the next.

### Level 1: CLI Script (Preferred)

```bash
cd /Users/leobrival/Developer/plugins/serum-plugins-official/plugins/html-checker/scripts && ./check-forms <url> [options]
```

### Level 2: Chrome DevTools MCP

If the script fails, use Chrome DevTools MCP:

1. Navigate to page:
   ```
   mcp__chrome-devtools__navigate_page with url: <url>
   ```

2. Extract form information:
   ```
   mcp__chrome-devtools__evaluate_script with function:
   ```
   ```javascript
   () => {
     const forms = [];
     document.querySelectorAll('form').forEach((form, fi) => {
       const inputs = [];
       form.querySelectorAll('input, select, textarea').forEach((input, ii) => {
         const id = input.id;
         const label = id ? document.querySelector(`label[for="${id}"]`) : null;
         inputs.push({
           type: input.type || input.tagName.toLowerCase(),
           name: input.name,
           id: id,
           hasLabel: !!label || !!input.getAttribute('aria-label'),
           labelText: label?.textContent?.trim() || null,
           placeholder: input.placeholder,
           required: input.required,
           autocomplete: input.getAttribute('autocomplete'),
           ariaLabel: input.getAttribute('aria-label'),
           index: ii
         });
       });
       forms.push({
         action: form.action,
         method: form.method,
         hasSubmit: !!form.querySelector('[type="submit"], button:not([type="button"])'),
         inputs: inputs,
         index: fi
       });
     });
     return forms;
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

3. Extract form information:
   ```
   mcp__claude-in-chrome__javascript_tool with action: "javascript_exec", tabId: <tabId>, text:
   ```
   ```javascript
   (() => {
     const forms = [];
     document.querySelectorAll('form').forEach((form, fi) => {
       const inputs = [];
       form.querySelectorAll('input, select, textarea').forEach((input, ii) => {
         const id = input.id;
         const label = id ? document.querySelector(`label[for="${id}"]`) : null;
         inputs.push({
           type: input.type || input.tagName.toLowerCase(),
           name: input.name,
           id: id,
           hasLabel: !!label || !!input.getAttribute('aria-label'),
           labelText: label?.textContent?.trim() || null,
           placeholder: input.placeholder,
           required: input.required,
           index: ii
         });
       });
       forms.push({
         action: form.action,
         method: form.method,
         hasSubmit: !!form.querySelector('[type="submit"], button:not([type="button"])'),
         inputs: inputs,
         index: fi
       });
     });
     return JSON.stringify(forms);
   })()
   ```

4. Analyze and report results

## Validation Rules

- All inputs have associated labels (via `<label for="">` or aria-label)
- Placeholders are not used as labels
- Forms have submit buttons
- Input types match content (email fields use type="email", phone use type="tel")

## Output Format

```
Form Analysis for <URL>

Summary:
  Total Forms: X
  Total Inputs: X
  Inputs with labels: X
  Inputs without labels: X

Issues:
  [SEVERITY] Description
```

## Severity Levels

- **ERROR**: Missing label, empty label
- **WARNING**: Placeholder as label, wrong input type, missing submit
- **INFO**: Missing autocomplete
