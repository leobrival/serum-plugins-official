# HTML Checker Plugin

HTML quality checker for SEO and accessibility - validates heading hierarchy (H1-H6) and link integrity.

## Features

- **Check Headings**: Analyze H1-H6 structure for SEO best practices
- **Check Links**: Validate links and buttons for proper navigation

## Installation

```bash
cd plugins/html-checker/scripts
bun install
```

## Commands

### /check-headings

Analyze HTML heading hierarchy on a web page.

```bash
/check-headings https://example.com
/check-headings https://example.com --verbose
```

**Checks performed:**

- Missing H1 heading
- Multiple H1 headings
- Skipped heading levels (H2 -> H4)
- Empty headings

### /check-links

Analyze links and buttons for navigation issues.

```bash
/check-links https://example.com
/check-links https://example.com --verbose
```

**Checks performed:**

- Empty href attributes
- javascript:void(0) links
- Hash-only (#) links
- Links without accessible text
- Buttons without actions

## CLI Usage

Direct script execution:

```bash
cd plugins/html-checker/scripts

# Check headings
bun src/check-headings.ts https://example.com --verbose

# Check links
bun src/check-links.ts https://example.com --verbose

# JSON output
bun src/check-headings.ts https://example.com --json
```

## Output Example

### Headings

```
Heading Analysis for https://example.com

Summary:
  H1: 1  H2: 5  H3: 12  H4: 3  H5: 0  H6: 0

Issues Found: 2
  [WARNING] Skipped from H2 to H4
  [ERROR  ] Empty H3 heading at position 8

Hierarchy:
  H1: Welcome to Example
    H2: About Us
      H3: Our Mission
```

### Links

```
Link Analysis for https://example.com

Summary:
  Total Links: 45
  Total Buttons: 12
  Issues Found: 5

Issues:
  [ERROR  ] Link with empty href at position 3
  [WARNING] Link with javascript: href at position 15
  [WARNING] Link with href="#" at position 28
```

## SEO Guidelines

### Headings

- One H1 per page matching the main topic
- Sequential hierarchy without skipping levels
- Descriptive text including target keywords
- Logical structure outlining page content

### Links

- All links must have valid destinations
- Use `<button>` for JavaScript actions
- Provide accessible text for all links
- Avoid empty href or hash-only links

## License

MIT
