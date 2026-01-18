# RGAA 4.1 Criteria Reference

French accessibility standard (Référentiel Général d'Amélioration de l'Accessibilité) based on WCAG 2.1.

## Overview

- **Total criteria:** 106 criteria with ~257 individual test cases
- **Thematic groups:** 13
- **Levels:** A (minimum), AA (recommended), AAA (enhanced)
- **Base standard:** WCAG 2.1 (tests 50 WCAG 2.1 AA criteria with granular precision)
- **Version:** 4.1.2 (April 2023 - current)
- **Mandatory for:** French public sector websites
- **Relationship to WCAG:** RGAA 4.1 compliance ensures WCAG 2.1 AA compliance

## 13 Thematic Groups

### 1. Images (9 criteria)

Every image must have an appropriate alternative.

**Critère 1.1** - Non-decorative images have alt text (Level A)
- WCAG: 1.1.1 Non-text Content
- Test: Check `<img>` elements have alt attribute
- Error: `<img src="product.jpg">` (no alt)
- Fix: `<img src="product.jpg" alt="Red shoes">`

**Critère 1.2** - Decorative images have empty alt (Level A)
- Test: Decorative images use `alt=""`
- Error: `<img src="decoration.png" alt="decoration">`
- Fix: `<img src="decoration.png" alt="">`

**Critère 1.3** - Informative images have detailed alternatives when needed (Level A)
- For complex images (charts, diagrams)
- Use longdesc or adjacent description

### 2. Frames (2 criteria)

Frame structure must be accessible.

**Critère 2.1** - Each frame has a title (Level A)
- WCAG: 4.1.2 Name, Role, Value
- Test: `<iframe>` has title attribute
- Fix: `<iframe title="Video player" src="...">`

### 3. Colors (4 criteria)

Information must not rely solely on color.

**Critère 3.1** - Information is not conveyed by color alone (Level A)
- WCAG: 1.4.1 Use of Color
- Example: Error messages need icons, not just red text

**Critère 3.2** - Contrast ratio 4.5:1 for normal text (Level AA)
- WCAG: 1.4.3 Contrast (Minimum)
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- Tool: Chrome DevTools contrast checker

**Critère 3.3** - Enhanced contrast 7:1 (Level AAA)
- WCAG: 1.4.6 Contrast (Enhanced)
- Recommended for better readability

### 4. Multimedia (13 criteria)

Audio and video must have alternatives.

**Critère 4.1** - Pre-recorded audio has transcript (Level A)
- WCAG: 1.2.1 Audio-only and Video-only

**Critère 4.2** - Pre-recorded video has captions (Level A)
- WCAG: 1.2.2 Captions (Prerecorded)

**Critère 4.3** - Pre-recorded video has audio description or alternative (Level A)
- WCAG: 1.2.3 Audio Description or Media Alternative

### 5. Tables (6 criteria)

Data tables must be properly structured.

**Critère 5.1** - Complex tables have summary (Level A)
- WCAG: 1.3.1 Info and Relationships
- Use `<caption>` or summary attribute

**Critère 5.2** - Table headers use `<th>` (Level A)
- Associate headers with `scope` or `headers`/`id`

**Critère 5.3** - Layout tables don't use structural markup (Level A)
- Don't use `<th>`, `scope`, `summary` for layout tables

### 6. Links (5 criteria)

Link purpose must be clear.

**Critère 6.1** - Link text alone or with context explains purpose (Level A)
- WCAG: 2.4.4 Link Purpose (In Context)
- Error: "Click here" without context
- Fix: "Read our accessibility policy"

**Critère 6.2** - Link title complements link text when needed (Level A)
- Use title attribute for additional context

### 7. Scripts (5 criteria)

JavaScript must be accessible.

**Critère 7.1** - JavaScript respects accessibility (Level A)
- WCAG: 4.1.2 Name, Role, Value
- Custom widgets need ARIA

**Critère 7.2** - JavaScript does not block keyboard navigation (Level A)
- WCAG: 2.1.1 Keyboard
- No keyboard traps

**Critère 7.3** - JavaScript changes are announced to assistive technology (Level A)
- Use ARIA live regions for dynamic content

### 8. Mandatory Elements (13 criteria)

Essential document elements must be present.

**Critère 8.1** - Document has valid doctype (Level A)
- `<!DOCTYPE html>`

**Critère 8.2** - Document uses valid HTML (Level A)
- Validate with W3C validator

**Critère 8.3** - HTML lang attribute is present and valid (Level A)
- WCAG: 3.1.1 Language of Page
- `<html lang="fr">`

**Critère 8.4** - Page title is relevant (Level A)
- WCAG: 2.4.2 Page Titled
- `<title>` describes page content

**Critère 8.5** - HTML lang changes are indicated (Level AA)
- WCAG: 3.1.2 Language of Parts
- `<span lang="en">Hello</span>` in French page

### 9. Document Structure (12 criteria)

Information must be structured with headings and landmarks.

**Critère 9.1** - Heading hierarchy is logical (Level A)
- WCAG: 1.3.1 Info and Relationships
- h1 → h2 → h3 (don't skip levels)
- Only one h1 per page

**Critère 9.2** - Document structure uses HTML5 semantics (Level A)
- `<header>`, `<nav>`, `<main>`, `<footer>`
- ARIA landmarks when HTML5 not possible

**Critère 9.3** - Lists use proper markup (Level A)
- `<ul>`, `<ol>`, `<li>` for lists
- `<dl>`, `<dt>`, `<dd>` for definition lists

### 10. Presentation (10 criteria)

Content and presentation must be separated.

**Critère 10.1** - CSS is used for presentation, not HTML (Level A)
- WCAG: 1.3.1 Info and Relationships
- Don't use `<b>`, `<i>` for semantics
- Use `<strong>`, `<em>`

**Critère 10.2** - Content remains comprehensible without CSS (Level A)
- Reading order makes sense without styles

**Critère 10.3** - Information is not conveyed by shape, size, or position alone (Level A)
- WCAG: 1.3.3 Sensory Characteristics

### 11. Forms (13 criteria)

Forms must be accessible and have clear labels.

**Critère 11.1** - Every form input has a label (Level A)
- WCAG: 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions
- Use `<label for="id">` or `aria-label`

**Critère 11.2** - Label is correctly associated (Level A)
- `<label for="email">Email</label>`
- `<input type="email" id="email">`

**Critère 11.3** - Grouped inputs have fieldset and legend (Level A)
- Use `<fieldset>` and `<legend>` for radio/checkbox groups

**Critère 11.4** - Required fields are indicated (Level A)
- Use `required` attribute or `aria-required="true"`
- Visual indicator (asterisk) must have text alternative

**Critère 11.5** - Form errors are clearly identified (Level A)
- WCAG: 3.3.1 Error Identification
- Associate error with field: `aria-describedby`

**Critère 11.6** - Error messages suggest corrections (Level A)
- WCAG: 3.3.3 Error Suggestion
- "Email invalid" → "Email format: name@example.com"

**Critère 11.7** - Input purpose is identified (Level AA)
- WCAG: 1.3.5 Identify Input Purpose
- Use HTML5 input types and autocomplete

### 12. Navigation (7 criteria)

Navigation must be consistent and accessible.

**Critère 12.1** - Skip links allow bypassing repeated content (Level A)
- WCAG: 2.4.1 Bypass Blocks
- "Skip to main content" link

**Critère 12.2** - Navigation structure is consistent (Level AA)
- WCAG: 3.2.3 Consistent Navigation
- Same order across pages

**Critère 12.3** - Breadcrumb trail when applicable (Level AA)
- Shows user location in hierarchy

**Critère 12.4** - Search function when applicable (Level AAA)
- For large sites

### 13. Consultation (8 criteria)

Content must be consultable by everyone.

**Critère 13.1** - Documents (PDF, Word, etc.) are accessible (Level A)
- WCAG: 1.3.1 Info and Relationships
- Provide accessible alternatives

**Critère 13.2** - Downloadable documents have accessible format or alternative (Level A)
- Indicate format and size: "Annual report (PDF, 2 MB)"

**Critère 13.3** - Content can be used in portrait and landscape (Level AA)
- WCAG: 1.3.4 Orientation
- Responsive design

**Critère 13.4** - Content is readable with 200% zoom (Level AA)
- WCAG: 1.4.4 Resize text
- No horizontal scrolling

**Critère 13.5** - Content can be used without gestures (Level A)
- WCAG: 2.5.1 Pointer Gestures
- Touch targets ≥44×44 CSS pixels

## RGAA to WCAG Mapping

| RGAA Criteria | WCAG 2.1 Success Criteria |
|---------------|---------------------------|
| Critère 1 | 1.1.1 Non-text Content (A) |
| Critère 3 | 1.4.3 Contrast (AA), 1.4.6 (AAA) |
| Critère 6 | 2.4.4 Link Purpose (A) |
| Critère 7 | 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A) |
| Critère 8 | 3.1.1 Language of Page (A), 2.4.2 Page Titled (A) |
| Critère 9 | 1.3.1 Info and Relationships (A) |
| Critère 11 | 3.3.1 Error Identification (A), 3.3.2 Labels (A) |
| Critère 12 | 2.4.1 Bypass Blocks (A), 3.2.3 Consistent Navigation (AA) |

## Testing Tools

### Automated

- **axe-core** - https://github.com/dequelabs/axe-core
- **pa11y** - https://pa11y.org/
- **Lighthouse** - Chrome DevTools
- **WAVE** - https://wave.webaim.org/

### Manual

- **Keyboard testing** - Tab, Shift+Tab, Enter, Escape
- **Screen readers** - NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Contrast checker** - Chrome DevTools
- **HTML validator** - https://validator.w3.org/

## Compliance Levels

- **Fully compliant**: 100% of criteria (106/106)
- **Substantially compliant**: ≥95% (101/106)
- **Partially compliant**: ≥75% (80/106)
- **Non-compliant**: <75%

## Common Violations

1. **Missing alt text** (Critère 1.1) - ~35% of sites
2. **Insufficient contrast** (Critère 3.2) - ~30% of sites
3. **Form labels missing** (Critère 11.1) - ~25% of sites
4. **Heading hierarchy skipped** (Critère 9.1) - ~20% of sites
5. **No skip links** (Critère 12.1) - ~15% of sites

## Resources

- [RGAA 4.1 Official](https://accessibilite.numerique.gouv.fr/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
