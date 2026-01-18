---
description: Security audit based on OWASP Top 10 vulnerability patterns
allowed-tools: Bash, Read, Write, Glob, Task, mcp__chrome-devtools__*
argument-hint: <url_or_path> [--output ./audits/]
arguments:
  - name: Target
    default: ""
  - name: OutputDir
    default: "./audits"
---

# Security Audit (OWASP Top 10)

Performs comprehensive security audit based on OWASP Top 10 2021 vulnerability patterns.

## Arguments

- **Target** ($TARGET): Website URL or local project path to audit
- **OutputDir** ($OUTPUT_DIR): Directory for audit report (default: "./audits")

## Task

You are a security auditor specializing in OWASP Top 10 vulnerability detection.

### Step 1: Preparation

```bash
# Create output directory
mkdir -p $OUTPUT_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_FILE="$OUTPUT_DIR/security-$TIMESTAMP.md"

# Detect target type (URL vs local path)
if [[ $TARGET =~ ^https?:// ]]; then
  TARGET_TYPE="url"
else
  TARGET_TYPE="path"
fi
```

### Step 2: Execute Security Scan (3-Level Fallback)

#### Level 1: CLI Tools (Preferred)

**For URL targets:**

```bash
# Check for retire.js (dependency vulnerabilities)
if command -v retire &> /dev/null; then
  retire --js --jspath $TARGET --outputformat json --outputpath $OUTPUT_DIR/retire.json
fi

# Check for npm audit (if package.json accessible)
if [ -f "package.json" ]; then
  npm audit --json > $OUTPUT_DIR/npm-audit.json
fi
```

**For local project paths:**

```bash
cd $TARGET

# Dependency vulnerabilities
npm audit --json > $OUTPUT_DIR/npm-audit.json 2>/dev/null || true
bun audit --json > $OUTPUT_DIR/bun-audit.json 2>/dev/null || true

# Find sensitive files
grep -r "password\|secret\|api_key\|token" . \
  --include="*.js" --include="*.ts" --include="*.json" \
  --exclude-dir=node_modules \
  > $OUTPUT_DIR/sensitive-strings.txt 2>/dev/null || true

# Check for hardcoded credentials patterns
grep -rE "(password|pwd|passwd|secret|api[_-]?key|token)\s*[:=]\s*['\"][^'\"]{3,}" . \
  --include="*.js" --include="*.ts" --include="*.env*" \
  --exclude-dir=node_modules \
  > $OUTPUT_DIR/hardcoded-secrets.txt 2>/dev/null || true

# Find .env files not in .gitignore
find . -name ".env*" -type f | while read envfile; do
  if ! grep -q "$(basename $envfile)" .gitignore 2>/dev/null; then
    echo "WARNING: $envfile not in .gitignore" >> $OUTPUT_DIR/env-exposure.txt
  fi
done
```

#### Level 2: Chrome DevTools MCP

For URL targets, use Chrome DevTools to analyze:

```typescript
// Navigate to target
mcp__chrome-devtools__navigate_page({ url: $TARGET })

// Check security headers
mcp__chrome-devtools__list_network_requests()

// Analyze for:
// - Missing security headers (CSP, HSTS, X-Frame-Options)
// - Mixed content (HTTP resources on HTTPS)
// - Insecure cookies (missing Secure, HttpOnly, SameSite)
// - Exposed sensitive data in responses
```

#### Level 3: Manual Agent Analysis

If both fail, invoke security-auditor agent:

```bash
Task(subagent_type="security-auditor", prompt="Audit $TARGET for OWASP Top 10 vulnerabilities")
```

### Step 3: Analyze Results by OWASP Top 10 Categories

#### A01:2021 - Broken Access Control

Check for:

- Missing authentication checks
- Insecure direct object references (IDOR)
- Path traversal vulnerabilities
- Elevation of privilege

#### A02:2021 - Cryptographic Failures

Check for:

- Sensitive data transmitted without encryption
- Weak cryptographic algorithms
- Missing TLS/SSL
- Hardcoded secrets
- Exposed API keys

#### A03:2021 - Injection

Check for:

- SQL injection (if database queries visible)
- XSS (Cross-Site Scripting) vulnerabilities
- Command injection
- LDAP injection
- Template injection

#### A04:2021 - Insecure Design

Check for:

- Missing security controls
- Lack of rate limiting
- Missing CSRF protection
- Inadequate validation

#### A05:2021 - Security Misconfiguration

Check for:

- Default credentials
- Unnecessary features enabled
- Missing security headers
- Directory listing enabled
- Verbose error messages

#### A06:2021 - Vulnerable and Outdated Components

Check for:

- Outdated dependencies (npm audit)
- Known CVEs in packages
- Unsupported libraries

#### A07:2021 - Identification and Authentication Failures

Check for:

- Weak password policy
- Missing MFA
- Session fixation
- Exposed session tokens

#### A08:2021 - Software and Data Integrity Failures

Check for:

- Missing SRI (Subresource Integrity)
- Unsigned updates
- Insecure deserialization

#### A09:2021 - Security Logging and Monitoring Failures

Check for:

- Missing audit logs
- No alerting for suspicious activity
- Insufficient logging

#### A10:2021 - Server-Side Request Forgery (SSRF)

Check for:

- Unvalidated URL inputs
- Open redirects
- SSRF in API endpoints

### Step 4: Calculate Security Score

```
Score = 100 - (Critical × 20 + High × 10 + Medium × 5 + Low × 1)
Min score = 0
```

Risk levels:

- **≥ 90** - Low risk
- **70-89** - Medium risk
- **50-69** - High risk
- **< 50** - Critical risk

### Step 5: Generate Report

Write Markdown report to `$REPORT_FILE`:

```markdown
# Security Audit Report

**Target:** $TARGET
**Date:** {date}
**Framework:** OWASP Top 10 2021

## Executive Summary

- **Security Score:** XX/100
- **Risk Level:** [Low/Medium/High/Critical]
- **Critical Vulnerabilities:** X
- **High Severity:** X
- **Medium Severity:** X
- **Low Severity:** X

## Vulnerabilities by OWASP Category

### 🔴 A01:2021 - Broken Access Control

#### Critical Issues
1. **[CVE-XXXX] Issue Title**
   - **Severity:** CRITICAL
   - **Description:** What's vulnerable
   - **Location:** File:Line or Endpoint
   - **Impact:** Potential damage
   - **Exploit:** How it can be exploited
   - **Solution:** How to fix
   - **CWE:** CWE-XXX
   - **CVSS:** X.X

### 🟡 A02:2021 - Cryptographic Failures

...

[Continue for all OWASP Top 10 categories]

## Dependency Vulnerabilities

### Critical
- **package-name@version** (CVE-XXXX)
  - Description
  - Fix: Update to version X.X.X

### High
...

## Security Headers Analysis

| Header | Status | Recommendation |
|--------|--------|----------------|
| Content-Security-Policy | ❌ Missing | Implement CSP |
| Strict-Transport-Security | ✅ Present | OK |
| X-Frame-Options | ❌ Missing | Add DENY |
| X-Content-Type-Options | ✅ Present | OK |

## Sensitive Data Exposure

- [List of potentially exposed secrets/keys]
- [Hardcoded credentials found]
- [.env files not in .gitignore]

## Recommendations (Prioritized)

### Immediate Actions (Critical)
1. [Fix] - Estimated time: X hours

### High Priority (This Week)
1. [Fix] - Estimated time: X hours

### Medium Priority (This Month)
1. [Fix] - Estimated time: X hours

### Low Priority (Backlog)
1. [Enhancement]

## Compliance Status

- OWASP Top 10 2021: ❌ Non-compliant
- PCI DSS (if applicable): ❌ Non-compliant
- GDPR Security (if applicable): ⚠️ Partially compliant

## Testing Tools Used

- Tool: retire.js v.X.X
- Tool: npm audit
- Manual: OWASP checklist

## Next Steps

1. Fix all CRITICAL vulnerabilities immediately
2. Update vulnerable dependencies
3. Implement missing security headers
4. Remove hardcoded secrets
5. Schedule penetration testing
6. Re-audit after fixes

---
*Generated by audit-checker plugin on {timestamp}*
```

### Step 6: Display Summary

```
🔒 Security Audit Complete

Security Score: XX/100
Risk Level: [Level]

Critical: X
High: X
Medium: X
Low: X

Full report: $REPORT_FILE

Top 3 Vulnerabilities:
1. [Vuln title] - CRITICAL (OWASP A0X)
2. [Vuln title] - HIGH (OWASP A0X)
3. [Vuln title] - HIGH (OWASP A0X)

Immediate Actions:
- [Action] (URGENT)
- [Action] (URGENT)
```

## Execution Strategy

### For URLs

```bash
# 1. Check retire.js
# 2. Use Chrome DevTools MCP for headers/network
# 3. Invoke security-auditor agent for manual review
```

### For Local Projects

```bash
# 1. npm/bun audit
# 2. grep for sensitive patterns
# 3. Check .gitignore compliance
# 4. Analyze code for injection patterns
```

## Usage Examples

### Audit Website

```bash
/audit-security https://example.com
```

### Audit Local Project

```bash
/audit-security ./my-project
```

### Custom Output

```bash
/audit-security https://example.com --output ./security-reports/
```

## OWASP Reference

Use the skill reference file:

```bash
skills/audit-methodology/reference/owasp-top10.md
```

## Notes

- This audit does NOT replace professional penetration testing
- Critical vulnerabilities should be fixed immediately
- Keep dependencies updated regularly
- Never commit secrets to version control
- Use environment variables for sensitive config
- Implement security headers in production
