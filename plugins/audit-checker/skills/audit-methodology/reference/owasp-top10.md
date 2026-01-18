# OWASP Top 10 2021 Reference

Ten most critical web application security risks.

## Changes from 2017

- **↑ A01** Broken Access Control (was #5)
- **NEW A04** Insecure Design
- **NEW A08** Software and Data Integrity Failures
- **NEW A10** Server-Side Request Forgery (SSRF)
- **↓ A03** Injection (was #1)
- **Merged** XML External Entities into A05

## A01:2021 - Broken Access Control

**↑ From #5 (2017)**

### Description

Failures in enforcing restrictions on authenticated users.

### Common Vulnerabilities

1. **IDOR (Insecure Direct Object References)**
   ```javascript
   // Vulnerable
   app.get('/api/user/:id', (req, res) => {
     const user = db.findById(req.params.id)
     res.json(user) // No ownership check!
   })

   // Secure
   app.get('/api/user/:id', auth, (req, res) => {
     if (req.params.id !== req.user.id) {
       return res.status(403).json({ error: 'Forbidden' })
     }
     const user = db.findById(req.params.id)
     res.json(user)
   })
   ```

2. **Path Traversal**
   ```javascript
   // Vulnerable
   app.get('/download', (req, res) => {
     res.sendFile(`/files/${req.query.file}`)
     // Attack: ?file=../../etc/passwd
   })

   // Secure
   const path = require('path')
   app.get('/download', (req, res) => {
     const safePath = path.normalize(req.query.file).replace(/^(\.\.(\/|\\|$))+/, '')
     res.sendFile(path.join('/files', safePath))
   })
   ```

3. **Privilege Escalation**
   - Modifying URLs to access admin functions
   - Changing user role in POST data

### Detection

```bash
# Find direct object references
Grep(pattern="\/api\/.*\/\d+|\/user\/\d+", glob="*.js")

# Check for authorization middleware
Grep(pattern="router\.(get|post|put|delete)", glob="*.js", -A=5)
```

### CWE Mappings

- CWE-22: Path Traversal
- CWE-284: Improper Access Control
- CWE-639: Authorization Bypass

---

## A02:2021 - Cryptographic Failures

**Was: Sensitive Data Exposure**

### Description

Failures related to cryptography leading to sensitive data exposure.

### Common Vulnerabilities

1. **Hardcoded Secrets**
   ```javascript
   // Vulnerable
   const API_KEY = "sk_live_abc123xyz789"
   const DB_PASSWORD = "admin123"

   // Secure
   const API_KEY = process.env.API_KEY
   const DB_PASSWORD = process.env.DB_PASSWORD
   ```

2. **Weak Encryption**
   ```javascript
   // Vulnerable - MD5/SHA1 for passwords
   const hash = crypto.createHash('md5').update(password).digest('hex')

   // Secure - bcrypt
   const bcrypt = require('bcrypt')
   const hash = await bcrypt.hash(password, 10)
   ```

3. **Insecure Transmission**
   ```javascript
   // Vulnerable
   fetch('http://api.example.com/user/profile') // HTTP!

   // Secure
   fetch('https://api.example.com/user/profile') // HTTPS
   ```

### Detection

```bash
# Find hardcoded secrets
Grep(pattern="(password|secret|api[_-]?key|token)\s*[:=]\s*['\"]", glob="*.{js,ts,json}")

# Check for weak crypto
Grep(pattern="md5|sha1|DES|RC4", glob="*.js")

# Find HTTP in production
Grep(pattern="http://.*api|http://.*prod", glob="*")
```

### CWE Mappings

- CWE-259: Use of Hard-coded Password
- CWE-327: Use of Broken Crypto
- CWE-311: Missing Encryption

---

## A03:2021 - Injection

**↓ From #1 (2017)**

### Description

Attacker supplies untrusted data to interpreter.

### Common Vulnerabilities

1. **SQL Injection**
   ```javascript
   // Vulnerable
   const query = "SELECT * FROM users WHERE email = '" + email + "'"
   db.execute(query)
   // Attack: email = ' OR '1'='1

   // Secure - Parameterized Query
   const query = "SELECT * FROM users WHERE email = ?"
   db.execute(query, [email])
   ```

2. **Cross-Site Scripting (XSS)**
   ```javascript
   // Vulnerable
   element.innerHTML = userInput

   // Secure
   element.textContent = userInput // Auto-escapes
   // Or use DOMPurify for rich content
   element.innerHTML = DOMPurify.sanitize(userInput)
   ```

3. **Command Injection**
   ```javascript
   // Vulnerable
   exec(`ping ${userInput}`)
   // Attack: userInput = "127.0.0.1; rm -rf /"

   // Secure - Use library or validate
   const { ping } = require('net-ping')
   // Or validate: /^[0-9.]+$/.test(userInput)
   ```

### Detection

```bash
# SQL Injection
Grep(pattern="execute\(.*\+|query\(.*\+|sql.*\$\{", glob="*.{js,ts}")

# XSS
Grep(pattern="innerHTML|outerHTML|document\.write", glob="*.{js,ts,jsx,tsx}")

# Command Injection
Grep(pattern="exec\(|spawn\(|eval\(", glob="*.js")
```

### CWE Mappings

- CWE-89: SQL Injection
- CWE-79: Cross-site Scripting
- CWE-77: Command Injection

---

## A04:2021 - Insecure Design

**NEW in 2021**

### Description

Missing or ineffective security controls in design phase.

### Common Issues

1. **No Rate Limiting**
   ```javascript
   // Vulnerable
   app.post('/login', (req, res) => {
     // No rate limiting - brute force possible
   })

   // Secure
   const rateLimit = require('express-rate-limit')
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // 5 requests per window
   })
   app.post('/login', limiter, (req, res) => { ... })
   ```

2. **Missing CSRF Protection**
   ```javascript
   // Vulnerable
   app.post('/transfer', (req, res) => {
     // No CSRF token check
   })

   // Secure
   const csrf = require('csurf')
   app.use(csrf())
   app.post('/transfer', (req, res) => {
     // CSRF token validated automatically
   })
   ```

3. **Insufficient Input Validation**
   - No validation on business logic
   - Trusting client-side validation only

### Detection

```bash
# Missing rate limiting
Grep(pattern="app\.(post|put)\(.*login|\/api\/", glob="*.js", -A=10)

# No CSRF protection
Grep(pattern="csrf|csurf", glob="package.json")
```

### CWE Mappings

- CWE-209: Information Exposure
- CWE-256: Plaintext Storage
- CWE-501: Trust Boundary Violation

---

## A05:2021 - Security Misconfiguration

**Same position as 2017**

### Description

Missing security hardening or improperly configured permissions.

### Common Issues

1. **Debug Mode in Production**
   ```javascript
   // Vulnerable
   const DEBUG = true
   if (DEBUG) console.log(error.stack)

   // Secure
   const DEBUG = process.env.NODE_ENV !== 'production'
   ```

2. **Default Credentials**
   ```javascript
   // Vulnerable
   const ADMIN_USER = "admin"
   const ADMIN_PASS = "admin"

   // Secure - Force change on first login
   // Never use default credentials
   ```

3. **Missing Security Headers**
   ```javascript
   // Secure
   app.use((req, res, next) => {
     res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
     res.setHeader('X-Content-Type-Options', 'nosniff')
     res.setHeader('X-Frame-Options', 'DENY')
     res.setHeader('Content-Security-Policy', "default-src 'self'")
     next()
   })
   ```

### Detection

```bash
# Debug mode
Grep(pattern="debug.*true|NODE_ENV.*development", glob="*")

# Default credentials
Grep(pattern="admin.*admin|password.*password", glob="*")

# Check headers
curl -I https://example.com
```

### CWE Mappings

- CWE-16: Configuration
- CWE-2: Environmental Security Flaws

---

## A06:2021 - Vulnerable and Outdated Components

**↑ From #9 (2017)**

### Description

Using components with known vulnerabilities.

### Detection

```bash
# NPM audit
npm audit --json > audit.json
jq '.vulnerabilities | length' audit.json

# Retire.js
retire --js --outputformat json --outputpath retire.json

# Check package age
npm outdated
```

### Remediation

1. **Keep dependencies updated**
   ```bash
   npm update
   npm audit fix
   ```

2. **Remove unused dependencies**
   ```bash
   npx depcheck
   ```

3. **Use lock files**
   - `package-lock.json` (npm)
   - `bun.lockb` (bun)

### CWE Mappings

- CWE-1104: Use of Unmaintained Third Party Components

---

## A07:2021 - Identification and Authentication Failures

**Was: Broken Authentication**

### Common Vulnerabilities

1. **Weak Password Requirements**
   ```javascript
   // Vulnerable
   if (password.length < 6) reject()

   // Secure
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
   if (!passwordRegex.test(password)) reject()
   ```

2. **Predictable Session IDs**
   ```javascript
   // Vulnerable
   const sessionId = Math.random().toString()

   // Secure
   const crypto = require('crypto')
   const sessionId = crypto.randomBytes(32).toString('hex')
   ```

3. **No MFA**
   - Implement TOTP (Time-based One-Time Password)
   - Use libraries like `speakeasy` or `otpauth`

### CWE Mappings

- CWE-287: Improper Authentication
- CWE-384: Session Fixation

---

## A08:2021 - Software and Data Integrity Failures

**NEW in 2021**

### Description

Code and infrastructure not protected against integrity violations.

### Common Issues

1. **Missing SRI (Subresource Integrity)**
   ```html
   <!-- Vulnerable -->
   <script src="https://cdn.example.com/lib.js"></script>

   <!-- Secure -->
   <script src="https://cdn.example.com/lib.js"
           integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
           crossorigin="anonymous"></script>
   ```

2. **Insecure Deserialization**
   ```javascript
   // Vulnerable
   const obj = JSON.parse(untrustedData)
   eval(obj.code) // Never do this!

   // Secure
   const obj = JSON.parse(untrustedData)
   // Validate schema before using
   ```

### CWE Mappings

- CWE-502: Deserialization of Untrusted Data
- CWE-829: Inclusion of Functionality from Untrusted Control Sphere

---

## A09:2021 - Security Logging and Monitoring Failures

**Same position as 2017**

### Description

Insufficient logging and monitoring delays breach detection.

### Best Practices

```javascript
// Log security events
const winston = require('winston')
const logger = winston.createLogger({ ... })

app.post('/login', (req, res) => {
  if (!validCredentials) {
    logger.warn('Failed login attempt', {
      ip: req.ip,
      email: req.body.email,
      timestamp: new Date()
    })
  }
})

// Monitor suspicious patterns
// - Multiple failed logins
// - Privilege escalation attempts
// - Unusual data access patterns
```

### CWE Mappings

- CWE-778: Insufficient Logging
- CWE-223: Omission of Security-relevant Information

---

## A10:2021 - Server-Side Request Forgery (SSRF)

**NEW in 2021**

### Description

Fetching remote resource without validating user-supplied URL.

### Vulnerability Example

```javascript
// Vulnerable
app.get('/fetch', async (req, res) => {
  const data = await fetch(req.query.url) // User controls URL!
  res.json(data)
  // Attack: ?url=http://localhost:8080/admin
})

// Secure
const allowedDomains = ['api.example.com', 'cdn.example.com']
app.get('/fetch', async (req, res) => {
  const url = new URL(req.query.url)
  if (!allowedDomains.includes(url.hostname)) {
    return res.status(400).json({ error: 'Invalid domain' })
  }
  const data = await fetch(url.toString())
  res.json(data)
})
```

### Detection

```bash
# Find user-controlled URLs
Grep(pattern="fetch\(.*req\.|axios\(.*params|url.*=.*req\.", glob="*.js")
```

### CWE Mappings

- CWE-918: Server-Side Request Forgery

---

## Quick Reference Table

| Rank | Category | Key CWE | Impact |
|------|----------|---------|--------|
| A01 | Broken Access Control | CWE-22, CWE-284 | Data breach, privilege escalation |
| A02 | Cryptographic Failures | CWE-259, CWE-327 | Sensitive data exposure |
| A03 | Injection | CWE-79, CWE-89 | RCE, data theft |
| A04 | Insecure Design | CWE-209, CWE-256 | Multiple attack vectors |
| A05 | Security Misconfiguration | CWE-16 | System compromise |
| A06 | Vulnerable Components | CWE-1104 | Known exploits |
| A07 | Auth Failures | CWE-287, CWE-384 | Account takeover |
| A08 | Integrity Failures | CWE-502 | Supply chain attacks |
| A09 | Logging Failures | CWE-778 | Undetected breaches |
| A10 | SSRF | CWE-918 | Internal system access |

## Testing Tools

- **OWASP ZAP** - Automated vulnerability scanner
- **Burp Suite** - Web application security testing
- **npm audit** - Dependency vulnerabilities
- **retire.js** - JavaScript library vulnerabilities
- **Snyk** - Open source security platform

## Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [CVE Database](https://cve.mitre.org/)
