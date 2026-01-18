# Core Web Vitals Reference

Google's user-centric performance metrics and ranking signals.

## Overview

**Core Web Vitals** are the subset of Web Vitals that apply to all web pages and are key ranking factors for Google Search (since June 2021).

## The 3 Core Web Vitals

### 1. LCP (Largest Contentful Paint)

**What it measures:** Loading performance

**Metric:** Time until largest content element becomes visible

**Thresholds:**
- ✅ **Good:** ≤ 2.5 seconds
- ⚠️ **Needs Improvement:** 2.5 - 4.0 seconds
- ❌ **Poor:** > 4.0 seconds

**Weight in Lighthouse:** 25%

**Common LCP Elements:**
- `<img>` elements
- `<video>` elements (poster image)
- Background images via CSS `url()`
- Block-level text elements

**Optimization Strategies:**

1. **Optimize Server Response (TTFB)**
   ```nginx
   # Enable caching
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

2. **Preload LCP Resource**
   ```html
   <link rel="preload" as="image" href="/hero.webp">
   ```

3. **Use Responsive Images**
   ```html
   <img srcset="hero-400.webp 400w,
                hero-800.webp 800w,
                hero-1200.webp 1200w"
        sizes="(max-width: 400px) 400px,
               (max-width: 800px) 800px,
               1200px"
        src="hero-800.webp"
        alt="Hero image">
   ```

4. **Eliminate Render-Blocking Resources**
   ```html
   <!-- Defer non-critical JS -->
   <script defer src="analytics.js"></script>

   <!-- Async for independent scripts -->
   <script async src="ads.js"></script>
   ```

---

### 2. INP (Interaction to Next Paint)

**Replaced FID (First Input Delay) in March 2024**

**What it measures:** Responsiveness to user interactions

**Metric:** Delay from user interaction to next visual update

**Thresholds:**
- ✅ **Good:** ≤ 200 milliseconds
- ⚠️ **Needs Improvement:** 200 - 500 milliseconds
- ❌ **Poor:** > 500 milliseconds

**Weight in Lighthouse:** 25%

**What Counts as Interaction:**
- Clicks
- Taps
- Keyboard presses (not scrolling)

**Optimization Strategies:**

1. **Break Up Long Tasks**
   ```javascript
   // Bad - Long task blocks main thread
   function processData(items) {
     items.forEach(item => {
       // Heavy processing (>50ms)
     })
   }

   // Good - Break into chunks
   async function processData(items) {
     for (let i = 0; i < items.length; i++) {
       await processItem(items[i])
       // Yield to browser every iteration
       if (i % 10 === 0) {
         await new Promise(resolve => setTimeout(resolve, 0))
       }
     }
   }
   ```

2. **Use Web Workers**
   ```javascript
   // Heavy computation in worker
   const worker = new Worker('heavy-task.js')
   worker.postMessage({ data: largeDataset })
   worker.onmessage = (e) => {
     console.log('Result:', e.data)
   }
   ```

3. **Debounce Event Handlers**
   ```javascript
   function debounce(func, wait) {
     let timeout
     return function(...args) {
       clearTimeout(timeout)
       timeout = setTimeout(() => func.apply(this, args), wait)
     }
   }

   input.addEventListener('keyup', debounce(() => {
     // Handle input
   }, 300))
   ```

4. **Optimize JavaScript Execution**
   - Code splitting
   - Tree shaking
   - Minimize main thread work

---

### 3. CLS (Cumulative Layout Shift)

**What it measures:** Visual stability

**Metric:** Sum of all unexpected layout shift scores

**Thresholds:**
- ✅ **Good:** ≤ 0.1
- ⚠️ **Needs Improvement:** 0.1 - 0.25
- ❌ **Poor:** > 0.25

**Weight in Lighthouse:** 25%

**Layout Shift Score Formula:**
```
shift score = impact fraction × distance fraction

Impact fraction: % of viewport affected
Distance fraction: How far elements moved
```

**Common Causes:**
1. Images without dimensions
2. Ads/embeds/iframes without reserved space
3. Web fonts causing FOIT/FOUT
4. Dynamically injected content above existing content

**Optimization Strategies:**

1. **Set Image Dimensions**
   ```html
   <!-- Bad -->
   <img src="hero.jpg" alt="Hero">

   <!-- Good -->
   <img src="hero.jpg" alt="Hero" width="800" height="600">
   <!-- Or use aspect-ratio CSS -->
   <img src="hero.jpg" alt="Hero" style="aspect-ratio: 16/9; width: 100%;">
   ```

2. **Reserve Space for Ads**
   ```css
   .ad-slot {
     min-height: 250px; /* Reserve space */
     background: #f0f0f0;
   }
   ```

3. **Optimize Web Fonts**
   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('/fonts/custom.woff2') format('woff2');
     font-display: swap; /* or optional */
   }
   ```

   ```html
   <!-- Preload critical fonts -->
   <link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin>
   ```

4. **Avoid Inserting Content Above**
   ```javascript
   // Bad - Shifts content down
   element.insertBefore(newContent, existingContent)

   // Good - Append below
   element.appendChild(newContent)
   ```

---

## Secondary Metrics

### FCP (First Contentful Paint)

**What it measures:** When first content renders

**Thresholds:**
- ✅ Good: ≤ 1.8s
- ⚠️ Needs Improvement: 1.8-3.0s
- ❌ Poor: > 3.0s

**Weight in Lighthouse:** 10%

---

### TTI (Time to Interactive)

**What it measures:** When page becomes fully interactive

**Thresholds:**
- ✅ Good: ≤ 3.8s
- ⚠️ Needs Improvement: 3.8-7.3s
- ❌ Poor: > 7.3s

**Weight in Lighthouse:** 10%

**Criteria for TTI:**
1. FCP has occurred
2. Event handlers registered for most visible elements
3. Page responds to user input within 50ms
4. No long tasks (>50ms) for 5 seconds

---

### TBT (Total Blocking Time)

**What it measures:** Sum of blocking time of long tasks

**Thresholds:**
- ✅ Good: ≤ 200ms
- ⚠️ Needs Improvement: 200-600ms
- ❌ Poor: > 600ms

**Weight in Lighthouse:** 5%

**Long Task:** Any task that blocks main thread for >50ms

---

### Speed Index

**What it measures:** How quickly content is visually displayed

**Thresholds:**
- ✅ Good: ≤ 3.4s
- ⚠️ Needs Improvement: 3.4-5.8s
- ❌ Poor: > 5.8s

---

## Lighthouse Performance Score

**Formula:** Weighted average of all metrics

```
Score = (LCP × 0.25) + (INP × 0.25) + (CLS × 0.25) +
        (FCP × 0.10) + (TTI × 0.10) + (TBT × 0.05)
```

**Ratings:**
- **90-100:** Excellent (Green)
- **75-89:** Good (Orange)
- **50-74:** Needs Improvement (Orange)
- **0-49:** Poor (Red)

---

## Performance Budgets

Set limits to prevent regression:

```json
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "total",
          "budget": 1000
        },
        {
          "resourceType": "script",
          "budget": 300
        },
        {
          "resourceType": "image",
          "budget": 500
        },
        {
          "resourceType": "stylesheet",
          "budget": 50
        }
      ],
      "resourceCounts": [
        {
          "resourceType": "total",
          "budget": 50
        },
        {
          "resourceType": "third-party",
          "budget": 10
        }
      ],
      "timings": [
        {
          "metric": "interactive",
          "budget": 3800
        },
        {
          "metric": "first-contentful-paint",
          "budget": 1800
        }
      ]
    }
  ]
}
```

---

## Measurement Tools

### Lab Tools (Synthetic)

1. **Lighthouse** (Chrome DevTools)
   ```bash
   lighthouse https://example.com \
     --only-categories=performance \
     --preset=desktop
   ```

2. **WebPageTest**
   - https://www.webpagetest.org/
   - Test from multiple locations
   - Video comparison

3. **Chrome DevTools Performance Panel**
   - Record performance trace
   - Analyze frame drops
   - Identify long tasks

### Field Tools (Real User Monitoring)

1. **Chrome User Experience Report (CrUX)**
   - Real user data from Chrome browsers
   - https://developers.google.com/web/tools/chrome-user-experience-report

2. **PageSpeed Insights**
   - Combines lab + field data
   - https://pagespeed.web.dev/

3. **Search Console (Core Web Vitals Report)**
   - See how Google sees your pages
   - Grouped by similar URLs

4. **Web Vitals JavaScript Library**
   ```javascript
   import {onCLS, onINP, onLCP} from 'web-vitals'

   function sendToAnalytics({name, value, id}) {
     // Send to your analytics endpoint
     navigator.sendBeacon('/analytics', JSON.stringify({
       metric: name,
       value: value,
       id: id
     }))
   }

   onCLS(sendToAnalytics)
   onINP(sendToAnalytics)
   onLCP(sendToAnalytics)
   ```

---

## Optimization Priority

### High Impact

1. **Eliminate render-blocking resources** (saves 1-3s)
2. **Optimize LCP image** (saves 0.5-2s)
3. **Enable text compression** (saves 0.3-1s)
4. **Reduce unused JavaScript** (saves 0.5-1.5s)

### Medium Impact

1. **Lazy load off-screen images** (saves 0.3-0.8s)
2. **Minify CSS/JS** (saves 0.2-0.5s)
3. **Use CDN** (saves 0.1-0.5s depending on geography)

### Low Impact

1. **Reduce initial server response time** (TTFB)
2. **Avoid enormous network payloads**
3. **Serve static assets with efficient cache policy**

---

## Common Issues & Solutions

### Issue: High LCP (> 4s)

**Causes:**
- Large image (> 1 MB)
- Render-blocking CSS/JS
- Slow server response (TTFB > 600ms)

**Solutions:**
- Convert to WebP/AVIF
- Preload LCP resource
- Use CDN
- Optimize server (caching, faster hosting)

---

### Issue: High INP (> 500ms)

**Causes:**
- Long tasks blocking main thread
- Heavy JavaScript execution
- Excessive DOM size

**Solutions:**
- Code splitting
- Web workers for heavy computation
- Debounce event handlers
- Reduce DOM size

---

### Issue: High CLS (> 0.25)

**Causes:**
- Images without dimensions
- Web fonts loading
- Ads injecting content

**Solutions:**
- Set width/height on images
- Use `font-display: swap`
- Reserve space for ads
- Avoid dynamically injecting content above fold

---

## Real-World Benchmarks

| Site Type | Good LCP | Good INP | Good CLS |
|-----------|----------|----------|----------|
| Blog | < 2.0s | < 150ms | < 0.05 |
| E-commerce | < 2.5s | < 200ms | < 0.1 |
| SaaS Dashboard | < 3.0s | < 200ms | < 0.1 |
| News Site | < 2.5s | < 200ms | < 0.15 |

---

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [CrUX Dashboard](https://developers.google.com/web/tools/chrome-user-experience-report)
