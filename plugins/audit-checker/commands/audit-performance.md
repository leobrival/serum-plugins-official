---
description: Performance audit based on Core Web Vitals and Lighthouse metrics
allowed-tools: Bash, Read, Write, Task, mcp__chrome-devtools__*
argument-hint: <url> [--device mobile|desktop] [--output ./audits/]
arguments:
  - name: URL
    default: ""
  - name: Device
    default: "mobile"
    options: ["mobile", "desktop", "both"]
  - name: OutputDir
    default: "./audits"
---

# Performance Audit (Lighthouse / Core Web Vitals)

Performs comprehensive performance audit using Lighthouse metrics and Core Web Vitals.

## Arguments

- **URL** ($URL): Target website URL to audit
- **Device** ($DEVICE): Device type for emulation (default: "mobile")
- **OutputDir** ($OUTPUT_DIR): Directory for audit report (default: "./audits")

## Task

You are a performance auditor specializing in Core Web Vitals and Lighthouse metrics.

### Step 1: Preparation

```bash
# Create output directory
mkdir -p $OUTPUT_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_FILE="$OUTPUT_DIR/performance-$TIMESTAMP.md"
```

### Step 2: Execute Performance Audit (3-Level Fallback)

#### Level 1: Lighthouse CLI (Preferred)

```bash
if command -v lighthouse &> /dev/null; then
  # Mobile audit
  if [ "$DEVICE" = "mobile" ] || [ "$DEVICE" = "both" ]; then
    lighthouse $URL \
      --only-categories=performance \
      --form-factor=mobile \
      --screenEmulation.mobile=true \
      --output json \
      --output html \
      --output-path $OUTPUT_DIR/lighthouse-mobile-$TIMESTAMP
  fi

  # Desktop audit
  if [ "$DEVICE" = "desktop" ] || [ "$DEVICE" = "both" ]; then
    lighthouse $URL \
      --only-categories=performance \
      --form-factor=desktop \
      --screenEmulation.mobile=false \
      --output json \
      --output html \
      --output-path $OUTPUT_DIR/lighthouse-desktop-$TIMESTAMP
  fi
fi
```

#### Level 2: Chrome DevTools MCP

If Lighthouse CLI unavailable:

```typescript
// Navigate to URL
mcp__chrome-devtools__navigate_page({ url: $URL })

// Emulate device
if ($DEVICE === "mobile") {
  mcp__chrome-devtools__emulate({
    viewport: { width: 375, height: 667 },
    userAgent: "mobile",
    networkConditions: "Fast 3G"
  })
}

// Start performance trace
mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})

// Get trace results
mcp__chrome-devtools__performance_stop_trace({
  filePath: `$OUTPUT_DIR/trace-$TIMESTAMP.json`
})

// Analyze Core Web Vitals from trace
// Extract: LCP, FID, CLS, TTFB, FCP, TTI
```

#### Level 3: Manual Agent Analysis

If both fail, invoke performance-auditor agent:

```bash
Task(subagent_type="performance-auditor", prompt="Audit $URL for Core Web Vitals and performance metrics")
```

### Step 3: Extract Core Web Vitals

Parse Lighthouse JSON results for key metrics:

**Core Web Vitals (Primary)**

- **LCP** (Largest Contentful Paint)
  - Good: ≤ 2.5s
  - Needs Improvement: 2.5s - 4.0s
  - Poor: > 4.0s

- **INP** (Interaction to Next Paint) [Replaces FID since March 12, 2024]
  - Good: ≤ 200ms
  - Needs Improvement: 200-500ms
  - Poor: > 500ms
  - Note: First Input Delay (FID) is deprecated and no longer used as a Core Web Vital

- **CLS** (Cumulative Layout Shift)
  - Good: ≤ 0.1
  - Needs Improvement: 0.1 - 0.25
  - Poor: > 0.25

**Secondary Metrics**

- **FCP** (First Contentful Paint): ≤ 1.8s (good)
- **TTI** (Time to Interactive): ≤ 3.8s (diagnostic only - removed from Lighthouse score)
- **TBT** (Total Blocking Time): ≤ 200ms (good)
- **Speed Index**: ≤ 3.4s (good)

### Step 4: Analyze Performance Opportunities

Categorize issues by type:

1. **Render-Blocking Resources**
   - CSS blocking render
   - Unoptimized JavaScript

2. **Image Optimization**
   - Unoptimized images
   - Missing modern formats (WebP, AVIF)
   - No lazy loading

3. **JavaScript**
   - Large bundles
   - Unused JavaScript
   - Long tasks blocking main thread

4. **CSS**
   - Unused CSS
   - Large stylesheets

5. **Fonts**
   - Web font loading delays
   - Missing font-display

6. **Network**
   - No HTTP/2 or HTTP/3
   - Missing compression
   - No CDN

7. **Caching**
   - Missing cache headers
   - Suboptimal cache policies

### Step 5: Calculate Performance Score

```
Overall Score = Weighted average of all metrics
LCP (25%), FID/INP (25%), CLS (25%), FCP (10%), TTI (10%), TBT (5%)
```

Pass criteria:

- **≥ 90** - Excellent performance
- **75-89** - Good performance
- **50-74** - Needs improvement
- **< 50** - Poor performance

### Step 6: Generate Report

Write Markdown report to `$REPORT_FILE`:

```markdown
# Performance Audit Report

**URL:** $URL
**Device:** $DEVICE
**Date:** {date}
**Framework:** Lighthouse 11+ / Core Web Vitals

## Executive Summary

- **Performance Score:** XX/100
- **Rating:** [Excellent/Good/Needs Improvement/Poor]
- **Core Web Vitals:** [Pass/Fail]

## Core Web Vitals

### ⚡ Largest Contentful Paint (LCP)
- **Value:** X.XXs
- **Status:** ✅ Good / ⚠️ Needs Improvement / ❌ Poor
- **Target:** ≤ 2.5s
- **Impact:** User perceives page as loaded

### 🖱️ Interaction to Next Paint (INP)
- **Value:** XXXms
- **Status:** ✅ Good / ⚠️ Needs Improvement / ❌ Poor
- **Target:** ≤ 200ms
- **Impact:** Responsiveness to user input
- **Note:** INP replaced First Input Delay (FID) as a Core Web Vital on March 12, 2024. This audit uses the current INP standard.

### 📐 Cumulative Layout Shift (CLS)
- **Value:** 0.XXX
- **Status:** ✅ Good / ⚠️ Needs Improvement / ❌ Poor
- **Target:** ≤ 0.1
- **Impact:** Visual stability

## Secondary Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| First Contentful Paint (FCP) | X.XXs | ≤ 1.8s | ✅/⚠️/❌ |
| Time to Interactive (TTI) | X.XXs | ≤ 3.8s | ✅/⚠️/❌ |
| Total Blocking Time (TBT) | XXXms | ≤ 200ms | ✅/⚠️/❌ |
| Speed Index | X.XXs | ≤ 3.4s | ✅/⚠️/❌ |

## Performance Issues (by Impact)

### 🔴 Critical (High Impact, Fix Immediately)

1. **Eliminate render-blocking resources**
   - **Savings:** X.XXs
   - **Resources:** [list of blocking files]
   - **Solution:**
     - Use async/defer for JavaScript
     - Inline critical CSS
     - Preload key resources

2. **Optimize images**
   - **Savings:** XXX KB
   - **Images:** [list of unoptimized images]
   - **Solution:**
     - Convert to WebP/AVIF
     - Add responsive images (srcset)
     - Implement lazy loading

### 🟡 Important (Medium Impact)

1. **Reduce unused JavaScript**
   - **Savings:** XXX KB
   - **Files:** [list]
   - **Solution:** Code splitting, tree shaking

2. **Minimize main-thread work**
   - **Blocking time:** XXXms
   - **Solution:** Move work to web workers

### 🔵 Enhancement (Low Impact)

1. **Enable text compression**
   - **Savings:** XXX KB
   - **Solution:** Enable gzip/brotli

## Detailed Diagnostics

### Network Analysis
- **Total Transfer Size:** XXX KB
- **Number of Requests:** XXX
- **Critical Request Chains:** X levels deep

### JavaScript Analysis
- **Total JS Size:** XXX KB
- **Unused JS:** XXX KB (XX%)
- **Long Tasks:** X tasks blocking main thread

### CSS Analysis
- **Total CSS Size:** XXX KB
- **Unused CSS:** XXX KB (XX%)

### Image Analysis
- **Total Image Size:** XXX KB
- **Unoptimized Images:** X images
- **Modern Format Adoption:** XX%

### Font Analysis
- **Web Fonts:** X fonts
- **Font Display:** [swap/block/auto]

### Caching
- **Static Assets Cached:** XX%
- **Cache-Control Headers:** [present/missing]

## Recommendations (Prioritized by Savings)

### Quick Wins (Highest Impact, Lowest Effort)

1. **Enable compression** (~X.XXs saved)
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Add cache headers** (~X.XXs on repeat visits)
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

### High Priority (This Sprint)

1. **Optimize images**
   - Convert to WebP: `cwebp input.jpg -o output.webp`
   - Add lazy loading: `<img loading="lazy" ...>`

2. **Eliminate render-blocking JS/CSS**
   - Defer non-critical JS
   - Inline critical CSS

### Medium Priority (Next Sprint)

1. **Code splitting**
2. **Implement CDN**
3. **Optimize fonts**

### Long-Term Improvements

1. **Implement HTTP/3**
2. **Progressive Web App**
3. **Edge caching**

## Mobile vs Desktop Comparison

| Metric | Mobile | Desktop | Delta |
|--------|--------|---------|-------|
| Performance Score | XX | XX | ±X |
| LCP | X.XXs | X.XXs | ±X.XXs |
| CLS | 0.XXX | 0.XXX | ±0.XXX |
| TBT | XXXms | XXXms | ±XXms |

## Budget Recommendations

Define performance budgets:

```json
{
  "timings": {
    "LCP": 2500,
    "FCP": 1800,
    "TBT": 200
  },
  "resourceSizes": {
    "total": 1500,
    "javascript": 500,
    "css": 100,
    "image": 700
  }
}
```

## Next Steps

1. Fix critical issues (render-blocking, images)
2. Implement caching strategy
3. Set up performance monitoring (RUM)
4. Re-audit after fixes
5. Monitor Core Web Vitals in production

---
*Generated by audit-checker plugin on {timestamp}*
*Lighthouse version: X.X.X*
```

### Step 7: Display Summary

```
⚡ Performance Audit Complete

Performance Score: XX/100
Rating: [Excellent/Good/Needs Improvement/Poor]

Core Web Vitals: [✅ Pass / ❌ Fail]
- LCP: X.XXs [✅/❌]
- INP: XXXms [✅/❌]
- CLS: 0.XXX [✅/❌]

Full report: $REPORT_FILE
Lighthouse HTML: $OUTPUT_DIR/lighthouse-*.html

Top 3 Opportunities:
1. [Opportunity] - Save X.XXs
2. [Opportunity] - Save X.XXs
3. [Opportunity] - Save X.XXs

Quick Wins:
- [Action] (~30 min)
- [Action] (~1 hour)
```

## Execution Strategy

### CLI Priority

```bash
# Check for Lighthouse
if command -v lighthouse &> /dev/null; then
  # Use Lighthouse CLI (most accurate)
else
  # Fall back to Chrome DevTools MCP
fi
```

### Device Emulation

- **Mobile**: 375x667, Fast 3G, Mobile UA
- **Desktop**: 1920x1080, Fast 4G, Desktop UA

## Usage Examples

### Mobile Audit (Default)

```bash
/audit-performance https://example.com
```

### Desktop Audit

```bash
/audit-performance https://example.com --device desktop
```

### Both Mobile and Desktop

```bash
/audit-performance https://example.com --device both
```

### Custom Output

```bash
/audit-performance https://example.com --output ./perf-reports/
```

## Core Web Vitals Reference

Use the skill reference file:

```bash
skills/audit-methodology/reference/cwv-metrics.md
```

## Notes

- Core Web Vitals are the primary ranking signals for Google
- Mobile performance is prioritized (mobile-first indexing)
- Real User Monitoring (RUM) should complement lab audits
- Performance budgets help prevent regressions
- Lighthouse scores are based on lab conditions, not real users
