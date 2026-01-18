---
description: Multi-domain audit orchestrator for accessibility, security, performance, and eco-design
allowed-tools: Bash, Read, Write, Glob, AskUserQuestion, Task
argument-hint: <url> [--domains a11y,security,performance,eco] [--output ./audits/]
arguments:
  - name: URL
    default: ""
  - name: Domains
    default: "all"
    options: ["all", "a11y", "security", "performance", "eco"]
  - name: OutputDir
    default: "./audits"
---

# Multi-Domain Audit Command

Orchestrates comprehensive audits across multiple domains: accessibility (RGAA 4.1), security (OWASP), performance (Lighthouse/CWV), and eco-design.

## Arguments

- **URL** ($URL): Target website URL to audit
- **Domains** ($DOMAINS): Comma-separated list of audit domains (default: "all")
  - `all` - Run all audits
  - `a11y` - Accessibility only
  - `security` - Security only
  - `performance` - Performance only
  - `eco` - Eco-design only
- **OutputDir** ($OUTPUT_DIR): Directory for audit reports (default: "./audits")

## Task

You are the audit orchestrator. Your role is to coordinate specialized audits across multiple domains.

### Step 1: Validate Input

1. Check if URL is provided and valid
2. Parse domains parameter (split by comma if multiple)
3. Verify output directory exists or create it

```bash
mkdir -p $OUTPUT_DIR
```

### Step 2: Determine Audit Scope

Based on $DOMAINS parameter:

- If "all" → Run all 4 audits
- If specific domains → Run only requested audits

Valid domains: `a11y`, `security`, `performance`, `eco`

### Step 3: Execute Audits

For each domain in scope, invoke the corresponding command:

```bash
# Accessibility
/audit-a11y $URL --output $OUTPUT_DIR

# Security
/audit-security $URL --output $OUTPUT_DIR

# Performance
/audit-performance $URL --output $OUTPUT_DIR

# Eco-design
/audit-eco $URL --output $OUTPUT_DIR
```

### Step 4: Generate Summary Report

Create a consolidated report at `$OUTPUT_DIR/audit-{timestamp}.md` with:

1. **Executive Summary**
   - Overall scores by domain (0-100)
   - Critical issues count
   - Compliance status

2. **Domain Breakdown**
   - Link to detailed report for each domain
   - Top 3 issues per domain
   - Quick wins (easy fixes with high impact)

3. **Prioritized Recommendations**
   - Sorted by severity (ERROR → WARNING → INFO)
   - Actionable steps
   - Estimated effort (Low/Medium/High)

4. **Next Steps**
   - Immediate actions required
   - Short-term improvements
   - Long-term strategy

### Step 5: Display Results

Output the summary to user with:

```markdown
# Audit Results for $URL

## Scores
- ♿ Accessibility: XX/100
- 🔒 Security: XX/100
- ⚡ Performance: XX/100
- 🌱 Eco-Design: XX/100

## Critical Issues: X

Full report saved to: $OUTPUT_DIR/audit-{timestamp}.md
```

## Execution Strategy (3-Level Fallback)

### Level 1: CLI Tools (Preferred)

Check if CLI tools are available:

```bash
which lighthouse && which pa11y && which retire
```

If available, use CLI-based audits for fastest and most accurate results.

### Level 2: Chrome DevTools MCP

If CLI unavailable, use Chrome DevTools MCP:

```bash
mcp__chrome-devtools__* tools
```

### Level 3: Manual Agent Analysis

If both fail, invoke specialized agents:

- Use Task tool with `a11y-auditor`, `security-auditor`, `performance-auditor`, `eco-auditor` agents
- Agents will manually inspect code and DOM

## Usage Examples

### Complete Audit (All Domains)

```bash
/audit https://example.com
```

### Specific Domains Only

```bash
/audit https://example.com --domains a11y,security
```

### Custom Output Directory

```bash
/audit https://example.com --output ./reports/2026-01/
```

### Single Domain (Use Specialized Command)

```bash
/audit-a11y https://example.com
```

## Output Format

```
./audits/
├── audit-20260117-143022.md          # Summary report
├── a11y-20260117-143022.md           # Accessibility details
├── security-20260117-143022.md       # Security details
├── performance-20260117-143022.md    # Performance details
└── eco-20260117-143022.md            # Eco-design details
```

## Notes

- All reports are in Markdown format for easy reading
- Timestamps use ISO 8601 format (YYYYMMDDTHHmmss)
- Reports include actionable recommendations with severity levels
- Use `/audit --help` to display this help message
