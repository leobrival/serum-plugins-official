# Audit Checker Plugin

Multi-domain audit suite for comprehensive web application analysis covering accessibility, security, performance, and eco-design.

## Overview

The Audit Checker plugin provides a complete auditing solution with specialized agents, slash commands, and methodologies for four critical domains:

- **Accessibility (RGAA 4.1)** - French accessibility standards compliance
- **Security (OWASP)** - OWASP Top 10 vulnerability detection
- **Performance (Lighthouse/CWV)** - Core Web Vitals and performance metrics
- **Eco-Design** - Environmental impact and digital sustainability

## Features

### Slash Commands

- `/audit` - Orchestrates multi-domain audits
- `/audit-a11y` - Accessibility audit (RGAA 4.1)
- `/audit-security` - Security audit (OWASP Top 10)
- `/audit-performance` - Performance audit (Lighthouse/CWV)
- `/audit-eco` - Eco-design audit

### Specialized Agents

- **a11y-auditor** - Accessibility expert for RGAA/WCAG compliance
- **security-auditor** - Security specialist for OWASP vulnerabilities
- **performance-auditor** - Performance expert for Core Web Vitals
- **eco-auditor** - Eco-design specialist for sustainable web practices

### Audit Methodology

Comprehensive skill with reference documentation for each domain:

- RGAA 4.1 criteria checklist
- OWASP Top 10 vulnerability patterns
- Core Web Vitals metrics and thresholds
- Eco-design best practices

## Execution Strategy

Each audit follows a 3-level fallback approach:

1. **Level 1: CLI Tools** (Preferred) - lighthouse, axe-core, retire.js
2. **Level 2: Chrome DevTools MCP** - Browser automation fallback
3. **Level 3: Manual Analysis** - Agent-driven code inspection

## Report Format

Audits generate structured Markdown reports with:

- **Severity Levels**: ERROR, WARNING, INFO, PASS
- **Domain Scores**: 0-100 rating per audit domain
- **Actionable Recommendations**: Prioritized fix suggestions
- **Compliance Status**: Standards conformance summary

## Usage Examples

### Complete Multi-Domain Audit

```bash
/audit https://example.com
```

### Single Domain Audit

```bash
/audit-a11y https://example.com
/audit-security https://example.com
/audit-performance https://example.com
/audit-eco https://example.com
```

### With Agent Assistance

Invoke specialized agents for deep analysis:

```
Use the a11y-auditor agent to analyze this page for RGAA 4.1 compliance
Use the security-auditor to review authentication flow
```

## Prerequisites

### Optional CLI Tools

For best results, install these CLI tools:

```bash
# Performance & Accessibility
npm install -g lighthouse

# Accessibility (detailed)
npm install -g pa11y pa11y-ci

# Security (dependency vulnerabilities)
npm install -g retire

# Alternative: axe-core CLI
npm install -g @axe-core/cli
```

All tools are optional - the plugin falls back to Chrome DevTools MCP if unavailable.

## Output Location

Audit reports are saved to:

```
./audits/
├── audit-{timestamp}.md           # Full multi-domain report
├── a11y-{timestamp}.md            # Accessibility report
├── security-{timestamp}.md        # Security report
├── performance-{timestamp}.md     # Performance report
└── eco-{timestamp}.md             # Eco-design report
```

## Integration with Other Tools

Works seamlessly with:

- **Chrome DevTools MCP** - Browser automation and DOM analysis
- **Claude in Chrome MCP** - Interactive page testing
- **Crawler Plugin** - Sitemap-wide auditing

## License

MIT
