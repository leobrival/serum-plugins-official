---
name: audit-methodology
description: Comprehensive audit methodology for web applications covering accessibility (RGAA 4.1), security (OWASP Top 10), performance (Core Web Vitals), and eco-design. Use when users need guidance on audit processes, testing methodologies, compliance standards, or audit best practices. Includes detailed reference documentation for each audit domain.
---

# Audit Methodology Skill

Comprehensive guidance for conducting multi-domain audits of web applications across accessibility, security, performance, and eco-design dimensions.

## Quick Start

### Run Complete Audit

```bash
/audit https://example.com
```

### Domain-Specific Audits

```bash
/audit-a11y https://example.com      # Accessibility (RGAA 4.1)
/audit-security ./project             # Security (OWASP Top 10)
/audit-performance https://example.com --device mobile
/audit-eco https://example.com
```

## Audit Domains

### 1. Accessibility (RGAA 4.1 / WCAG 2.1)

**What it checks:**
- Semantic HTML and document structure
- ARIA attributes and roles
- Keyboard navigation and focus management
- Color contrast and visual accessibility
- Form labels and error messages
- Alternative text for images
- Screen reader compatibility

**Tools:**
- axe-core CLI
- pa11y
- Lighthouse accessibility audit
- Chrome DevTools MCP

**Reference:** `reference/rgaa-criteria.md` (106 criteria)

### 2. Security (OWASP Top 10 2021)

**What it checks:**
- Broken access control (IDOR, privilege escalation)
- Cryptographic failures (hardcoded secrets, weak encryption)
- Injection vulnerabilities (SQL, XSS, command injection)
- Security misconfiguration (default credentials, verbose errors)
- Vulnerable dependencies (CVEs, outdated packages)
- Authentication failures (weak passwords, session hijacking)
- Missing security headers (CSP, HSTS, X-Frame-Options)
- SSRF and open redirects

**Tools:**
- npm audit / bun audit
- retire.js
- grep patterns for code analysis
- Chrome DevTools MCP for network security

**Reference:** `reference/owasp-top10.md`

### 3. Performance (Core Web Vitals)

**What it checks:**
- LCP (Largest Contentful Paint): ≤ 2.5s
- INP (Interaction to Next Paint): ≤ 200ms
- CLS (Cumulative Layout Shift): ≤ 0.1
- FCP, TTI, TBT, Speed Index
- Resource optimization (images, JS, CSS)
- Render-blocking resources
- Caching and compression

**Tools:**
- Lighthouse CLI
- Chrome DevTools MCP performance trace
- WebPageTest (external)

**Reference:** `reference/cwv-metrics.md`

### 4. Eco-Design (Digital Sustainability)

**What it checks:**
- Page weight (target: < 1 MB)
- Resource efficiency (unused code)
- Media optimization (WebP, lazy loading)
- Loading strategy (code splitting, tree shaking)
- Green hosting and infrastructure
- Carbon footprint calculation
- Third-party script impact

**Tools:**
- Chrome DevTools MCP for network analysis
- Lighthouse for resource metrics
- Website Carbon Calculator methodology

**Reference:** `reference/eco-checklist.md`

## Audit Process (Universal)

### Phase 1: Preparation

1. **Identify target**
   - URL for live sites
   - Local path for projects

2. **Set scope**
   - Single domain or all domains
   - Mobile/desktop/both

3. **Gather context**
   - Traffic estimates (for carbon calculation)
   - Compliance requirements
   - Existing issues/concerns

### Phase 2: Automated Testing

1. **CLI tools** (preferred)
   - Fastest and most accurate
   - lighthouse, axe-core, pa11y, npm audit

2. **Chrome DevTools MCP** (fallback)
   - When CLI unavailable
   - Browser automation

3. **Specialized agents** (manual)
   - Deep analysis when automation insufficient
   - Expert review for complex issues

### Phase 3: Manual Inspection

Automation catches only ~30-40% of issues. Manual checks required:

**Accessibility:**
- Keyboard navigation testing
- Screen reader testing
- Logical reading order
- Focus management in dynamic content

**Security:**
- Code review for business logic flaws
- Authentication flow testing
- Authorization boundary testing
- Session management validation

**Performance:**
- Real user experience testing
- Network throttling scenarios
- Different device testing
- Third-party script impact

**Eco-Design:**
- User journey analysis
- Content prioritization
- Progressive enhancement
- Accessibility ∩ Sustainability

### Phase 4: Severity Classification

Use consistent severity levels:

**CRITICAL/ERROR**
- Prevents core functionality
- Security vulnerability with high impact
- Compliance blocker (Level A failure)
- Example: SQL injection, no alt text on primary images

**HIGH/WARNING**
- Significantly impacts UX
- Security risk with medium impact
- Compliance issue (Level AA failure)
- Example: Poor contrast, XSS vulnerability, slow LCP

**MEDIUM/INFO**
- Minor UX impact
- Low security risk
- Enhancement opportunity
- Example: Missing meta descriptions, suboptimal caching

**LOW/PASS**
- Best practice suggestion
- Level AAA enhancement
- Optimization opportunity
- Example: More descriptive labels, further compression

### Phase 5: Reporting

Generate structured Markdown reports with:

1. **Executive Summary**
   - Score (0-100)
   - Compliance/Risk level
   - Issue counts by severity
   - Key metrics

2. **Detailed Findings**
   - Organized by domain/category
   - Issue description
   - Location (file:line or URL)
   - Impact explanation
   - Solution with code examples
   - Standards reference (WCAG, OWASP, etc.)

3. **Prioritized Recommendations**
   - Quick wins (high impact, low effort)
   - High priority (this sprint)
   - Medium priority (next month)
   - Long-term improvements

4. **Next Steps**
   - Immediate actions
   - Follow-up audit schedule
   - Monitoring recommendations

### Phase 6: Validation

After fixes:

1. Re-run automated tests
2. Manual verification
3. Compare before/after metrics
4. Update documentation

## Scoring Methodologies

### Accessibility Score

```
Score = (Passed Criteria / Total Criteria) × 100

Compliance Levels:
- 100%: Fully compliant
- ≥95%: Substantially compliant
- ≥75%: Partially compliant
- <75%: Non-compliant
```

### Security Score

```
Score = 100 - (Critical × 20 + High × 10 + Medium × 5 + Low × 1)
Min score = 0

Risk Levels:
- ≥90: Low risk
- 70-89: Medium risk
- 50-69: High risk
- <50: Critical risk
```

### Performance Score

```
Lighthouse weighted average:
- LCP: 25%
- INP: 25%
- CLS: 25%
- FCP: 10%
- TTI: 10%
- TBT: 5%

Ratings:
- ≥90: Excellent
- 75-89: Good
- 50-74: Needs improvement
- <50: Poor
```

### Eco-Design Score

```
Weighted criteria:
- Page Weight: 20%
- Resource Efficiency: 20%
- Loading Strategy: 15%
- Media Optimization: 15%
- Code Efficiency: 10%
- Infrastructure: 10%
- UX: 5%
- Third-Party: 5%

Sustainability:
- ≥85: Excellent (Green)
- 70-84: Good (Light Green)
- 50-69: Acceptable (Yellow)
- <50: Poor (Red)
```

## Multi-Domain Integration

When auditing across domains, look for synergies:

**Accessibility ∩ Performance**
- Optimized images help both (smaller = faster = less CO₂)
- Semantic HTML improves accessibility and reduces DOM size

**Security ∩ Performance**
- Security headers add negligible overhead
- HTTPS is required for HTTP/2 (performance boost)

**Performance ∩ Eco-Design**
- Every performance optimization reduces carbon footprint
- Lighter pages = less energy = lower emissions

**All Domains**
- Unused code: accessibility, security, performance, eco issue
- Third-party scripts: all domains affected

## Common Pitfalls

### 1. Over-Reliance on Automation

**Problem:** Tools miss 60-70% of issues

**Solution:**
- Always combine automated + manual testing
- Use specialized agents for deep analysis
- Test with real users when possible

### 2. Ignoring Context

**Problem:** One-size-fits-all recommendations

**Solution:**
- Consider site purpose and audience
- Balance compliance with UX
- Prioritize based on user impact

### 3. Fix Without Understanding

**Problem:** Applying solutions without understanding root cause

**Solution:**
- Analyze why the issue exists
- Ensure fix doesn't create new issues
- Document the reasoning

### 4. No Follow-Up

**Problem:** Audit without action plan

**Solution:**
- Clear, prioritized recommendations
- Assign owners and deadlines
- Schedule re-audit after fixes

## Reference Files

Detailed documentation for each domain:

### RGAA 4.1 Criteria
**File:** `reference/rgaa-criteria.md`

- 106 criteria in 13 thematic groups
- WCAG 2.1 mappings
- Conformance levels (A, AA, AAA)
- Testing procedures

### OWASP Top 10 2021
**File:** `reference/owasp-top10.md`

- All 10 vulnerability categories
- Common attack patterns
- Code examples (vulnerable + secure)
- Remediation strategies
- CWE mappings

### Core Web Vitals Metrics
**File:** `reference/cwv-metrics.md`

- LCP, INP, CLS thresholds
- Secondary metrics (FCP, TTI, TBT)
- Optimization strategies
- Performance budgets
- Measurement tools

### Eco-Design Checklist
**File:** `reference/eco-checklist.md`

- Page weight guidelines
- Carbon calculation formulas
- Resource optimization techniques
- Green hosting options
- Sustainability certifications

## Best Practices

### 1. Baseline First

Always establish a baseline before making changes:
- Run initial audit
- Document current state
- Set improvement targets
- Measure progress

### 2. Prioritize by Impact

Focus on issues that affect the most users:
- Critical > High > Medium > Low
- Common user journeys first
- High-traffic pages priority

### 3. Fix Root Causes

Don't just fix symptoms:
- Identify patterns across issues
- Address systemic problems
- Update development processes

### 4. Continuous Monitoring

Audits are not one-time:
- Automate where possible
- Regular re-audits (quarterly)
- CI/CD integration
- Real user monitoring

### 5. Educate Team

Share knowledge:
- Document findings and solutions
- Provide training
- Establish standards
- Build accessibility/security culture

## Integration with CI/CD

Automate audits in your pipeline:

```yaml
# .github/workflows/audit.yml
name: Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Accessibility Audit
        run: |
          npm install -g @axe-core/cli
          axe https://staging.example.com --exit

      - name: Security Audit
        run: npm audit --audit-level=high

      - name: Performance Audit
        run: |
          npm install -g lighthouse
          lighthouse https://staging.example.com \
            --only-categories=performance \
            --preset=desktop \
            --chrome-flags="--headless"
```

## Resources

- [RGAA 4.1 Reference](https://accessibilite.numerique.gouv.fr/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Web Vitals](https://web.dev/vitals/)
- [Sustainable Web Design](https://sustainablewebdesign.org/)

## When to Use This Skill

- Planning an audit strategy
- Understanding audit methodologies
- Interpreting audit results
- Prioritizing remediation efforts
- Setting compliance targets
- Training team on audits
- Establishing audit processes

## Related Commands

- `/audit` - Multi-domain audit
- `/audit-a11y` - Accessibility only
- `/audit-security` - Security only
- `/audit-performance` - Performance only
- `/audit-eco` - Eco-design only

## Related Agents

- `a11y-auditor` - Accessibility expert
- `security-auditor` - Security specialist
- `performance-auditor` - Performance expert
- `eco-auditor` - Eco-design specialist

Use these agents for deep, specialized analysis in each domain.
