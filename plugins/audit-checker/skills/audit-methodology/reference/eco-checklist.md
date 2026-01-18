# Eco-Design Checklist

Digital sustainability and Green IT best practices for web development.

## Environmental Context

### Digital Carbon Footprint

- **Global digital sector:** 4% of greenhouse gas emissions (2024)
- **Expected growth:** Double by 2025 if unchecked
- **Average web page:** 1.76g CO₂ per visit (2024)
- **Data transfer:** ~0.5g CO₂ per MB

### Energy Distribution

- **Data Centers:** 40% (servers, cooling, backup)
- **Network:** 30% (routers, transmission)
- **End-User Devices:** 30% (phones, laptops, screens)

**Key Insight:** Every byte matters. Reduce page weight = reduce energy = reduce CO₂

---

## Carbon Calculation

### Per-Visit Formula

```
CO₂ per visit = Page weight (MB) × 0.5g CO₂/MB × Energy mix factor

Energy mix factors:
- Green hosting: 0.2 (renewable energy)
- Standard hosting: 1.0 (baseline)
- Coal-heavy grid: 1.5 (high carbon)
```

### Annual Impact Formula

```
Annual CO₂ (kg) = Page weight (MB) × Monthly visitors × 12 × 0.5g / 1000

Example:
2 MB × 100,000 visitors/month × 12 × 0.5g / 1000 = 1,200 kg CO₂/year
```

### Real-World Equivalents

- **1 kg CO₂** = 5 km driven by average car
- **1 kg CO₂** = 1 tree absorbs in 1 year
- **1 kg CO₂** = 2 hours of HD video streaming
- **1 tree** absorbs ~20 kg CO₂/year

---

## Eco-Design Criteria

### 1. Page Weight (Target: < 1 MB)

**Measurement:**
```
Total page weight in KB
Breakdown: HTML + CSS + JS + Images + Fonts + Other
```

**Thresholds:**
- ✅ **Excellent:** < 500 KB
- ✅ **Good:** 500 KB - 1 MB
- ⚠️ **Acceptable:** 1-2 MB
- ❌ **Poor:** > 2 MB

**Industry Average (2024):** 2 MB

**Optimization:**
1. Compress images (WebP/AVIF)
2. Remove unused code
3. Minify CSS/JS
4. Enable gzip/brotli compression

---

### 2. Resource Efficiency

**Check for Waste:**

1. **Unused JavaScript**
   ```bash
   # Target: < 20% unused
   unusedJsPercent = (unusedJsBytes / totalJsBytes) × 100
   ```

2. **Unused CSS**
   ```bash
   # Target: < 30% unused
   unusedCssPercent = (unusedCssBytes / totalCssBytes) × 100
   ```

3. **Duplicate Dependencies**
   ```bash
   # Example: lodash + underscore (pick one)
   npm ls lodash
   npm ls underscore
   ```

4. **Dead Code**
   ```bash
   # Use tools like webpack-bundle-analyzer
   npx webpack-bundle-analyzer dist/stats.json
   ```

**Optimization:**
- Tree shaking
- Code splitting
- Remove unused packages: `npx depcheck`

---

### 3. Loading Strategy

**Checklist:**

- [ ] **Lazy loading** images/videos below fold
- [ ] **Code splitting** by route or component
- [ ] **Tree shaking** enabled in build tool
- [ ] **Dynamic imports** for heavy features
- [ ] **Service worker** caching for offline/repeat visits

**Example: Lazy Loading**
```html
<img src="hero.jpg" alt="Hero" loading="lazy">
```

**Example: Code Splitting**
```javascript
// Instead of:
import HeavyChart from './HeavyChart'

// Use dynamic import:
const HeavyChart = lazy(() => import('./HeavyChart'))
```

---

### 4. Media Optimization

**Image Optimization:**

1. **Modern Formats** (Target: >70% adoption)
   - WebP: ~30% smaller than JPEG
   - AVIF: ~50% smaller than JPEG
   - SVG for logos/icons

2. **Responsive Images**
   ```html
   <picture>
     <source type="image/avif" srcset="hero.avif">
     <source type="image/webp" srcset="hero.webp">
     <img src="hero.jpg" alt="Hero" width="800" height="600">
   </picture>
   ```

3. **Lazy Loading**
   ```html
   <img src="photo.jpg" loading="lazy" alt="Photo">
   ```

4. **Compression**
   ```bash
   # Convert to WebP
   cwebp -q 80 input.jpg -o output.webp

   # Convert to AVIF
   avif --quality 80 input.jpg output.avif
   ```

**Video Optimization:**

1. **Codec:** Use H.265 or VP9 (40% smaller than H.264)
2. **Adaptive bitrate:** Multiple resolutions
3. **Poster image:** Prevent autoplay
4. **Lazy loading:** Load on scroll

---

### 5. Code Efficiency

**Algorithmic Complexity:**

```javascript
// Bad - O(n²)
for (let i = 0; i < items.length; i++) {
  for (let j = 0; j < items.length; j++) {
    // Nested loop
  }
}

// Good - O(n)
const map = new Map()
for (let item of items) {
  map.set(item.id, item)
}
```

**Memory Efficiency:**

1. **Avoid memory leaks**
   ```javascript
   // Bad - Memory leak
   let cache = []
   function addToCache(item) {
     cache.push(item) // Never cleaned
   }

   // Good - Limited cache
   const cache = new Map()
   function addToCache(item) {
     if (cache.size > 100) {
       const firstKey = cache.keys().next().value
       cache.delete(firstKey)
     }
     cache.set(item.id, item)
   }
   ```

2. **Clean up listeners**
   ```javascript
   // Always remove event listeners
   component.addEventListener('click', handler)
   // Later:
   component.removeEventListener('click', handler)
   ```

**Minimal Re-renders:**

```javascript
// React example
const MemoizedComponent = React.memo(Component)

// Or use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

---

### 6. Hosting & Infrastructure

**Green Hosting Checklist:**

- [ ] Provider uses renewable energy
- [ ] PUE (Power Usage Effectiveness) < 1.5
- [ ] Carbon offset program
- [ ] Green Web Foundation certified

**Top Green Hosting Providers:**

1. **GreenGeeks** - 300% renewable energy
2. **DreamHost** - Carbon neutral
3. **Infomaniak** - 100% renewable (Switzerland)
4. **Kinsta** - Google Cloud (carbon neutral)
5. **A2 Hosting** - Carbon neutral

**Check if site uses green hosting:**
- https://www.thegreenwebfoundation.org/

**Infrastructure Optimization:**

1. **CDN** - Reduce transmission distance
   ```
   User in Paris → CDN edge in Paris (50 km)
   vs.
   User in Paris → Origin server in US (6,000 km)
   ```

2. **HTTP/2 or HTTP/3**
   - Multiplexing reduces connections
   - Header compression
   - Server push

3. **Compression**
   ```nginx
   # Nginx config
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   gzip_min_length 1000;

   # Or brotli (better compression)
   brotli on;
   brotli_types text/plain text/css application/json application/javascript;
   ```

4. **Caching**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

---

### 7. Sustainable UX

**Energy-Saving Features:**

1. **Dark Mode** (saves OLED screen energy)
   ```css
   @media (prefers-color-scheme: dark) {
     body {
       background: #000;
       color: #fff;
     }
   }
   ```

2. **Reduced Motion** (respects user preference)
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

3. **Content-First Approach**
   - Essential content loads first
   - Progressive enhancement
   - Works without JavaScript

4. **Accessible = Sustainable**
   - Semantic HTML = lighter DOM
   - Clear structure = faster parsing
   - Keyboard navigation = less CPU

5. **Device Longevity**
   - Support older devices
   - Responsive design
   - Progressive Web App

---

### 8. Third-Party Scripts

**Audit External Resources:**

```bash
# Count third-party domains
curl -s https://example.com | \
  grep -oP 'src="https?://\K[^/]+' | \
  sort -u | wc -l
```

**Common Culprits:**

| Script | Typical Size | Purpose | Alternative |
|--------|-------------|---------|-------------|
| Google Analytics | ~45 KB | Analytics | Plausible (~1 KB) |
| Facebook Pixel | ~38 KB | Marketing | Remove or load on-demand |
| Intercom | ~120 KB | Support | Email form |
| Google Maps | ~500 KB | Maps | Leaflet + OpenStreetMap |

**Optimization:**

1. **Minimize third-party scripts**
   - Remove unnecessary scripts
   - Load on-demand (facade pattern)

2. **Self-host when possible**
   ```html
   <!-- Instead of CDN -->
   <script src="/vendor/analytics-lite.js"></script>
   ```

3. **Async/defer loading**
   ```html
   <script async src="non-critical.js"></script>
   ```

---

## Page Weight Budgets

### By Site Type

| Site Type | Total | HTML | CSS | JS | Images | Fonts |
|-----------|-------|------|-----|----|----|-------|
| Blog | 500 KB | 20 KB | 30 KB | 100 KB | 300 KB | 50 KB |
| E-commerce | 1 MB | 30 KB | 50 KB | 300 KB | 500 KB | 100 KB |
| News | 800 KB | 40 KB | 40 KB | 200 KB | 450 KB | 70 KB |
| SaaS | 1.2 MB | 25 KB | 60 KB | 500 KB | 400 KB | 100 KB |

---

## Sustainability Certifications

### 1. Website Carbon Badge

**Criteria:** < 0.5g CO₂ per visit

**How to get it:**
1. Test at https://www.websitecarbon.com/
2. Optimize until passing
3. Add badge to site

```html
<a href="https://www.websitecarbon.com/">
  <img src="https://api.websitecarbon.com/badge?url=yoursite.com" alt="Carbon badge">
</a>
```

### 2. Green Web Foundation Check

**Criteria:** Hosted on green energy

**How to verify:**
https://www.thegreenwebfoundation.org/green-web-check/

### 3. B Corp Certification

Part of broader sustainability commitment for businesses.

---

## Monitoring & Continuous Improvement

### 1. Carbon Tracking

**Website Carbon Calculator API:**
```javascript
fetch(`https://api.websitecarbon.com/site?url=${url}`)
  .then(res => res.json())
  .then(data => {
    console.log('CO₂ per visit:', data.statistics.co2.grid.grams)
  })
```

### 2. Performance Budgets

In your CI/CD:

```json
{
  "budgets": [
    {
      "resourceSizes": [
        {"resourceType": "total", "budget": 1000},
        {"resourceType": "script", "budget": 300},
        {"resourceType": "image", "budget": 500}
      ]
    }
  ]
}
```

### 3. Regular Audits

Schedule:
- **Monthly:** Quick automated audit
- **Quarterly:** Full manual audit
- **After major releases:** Complete re-audit

---

## Quick Wins Checklist

Fast optimizations with high impact:

- [ ] Enable compression (gzip/brotli) - **Save 60-80%**
- [ ] Convert images to WebP - **Save 30-50%**
- [ ] Add lazy loading to images - **Save 20-40% initial load**
- [ ] Remove unused CSS/JS - **Save 10-30%**
- [ ] Enable caching - **Save 90% on repeat visits**
- [ ] Use CDN - **Save 20-50% on transfer time**
- [ ] Minify CSS/JS - **Save 10-20%**
- [ ] Add loading="lazy" to images - **Save 20-40%**

---

## Calculation Examples

### Example 1: Blog (500 KB)

```
Visitors: 10,000/month
Page weight: 500 KB = 0.5 MB
CO₂ per visit: 0.5 × 0.5g = 0.25g
Annual CO₂: 0.25g × 10,000 × 12 = 30 kg/year

Equivalent to:
- 150 km driven by car
- 1.5 trees needed for offset
- 60 hours of streaming
```

### Example 2: E-commerce (2 MB → 1 MB optimization)

```
Visitors: 100,000/month
Page weight before: 2 MB
Page weight after: 1 MB (50% reduction)

CO₂ before: 2 × 0.5g × 100,000 × 12 = 1,200 kg/year
CO₂ after: 1 × 0.5g × 100,000 × 12 = 600 kg/year

Savings: 600 kg CO₂/year

Equivalent to:
- 3,000 km NOT driven
- 30 trees worth of carbon absorption
- Removing 1 car from the road for 2 months
```

---

## Resources

### Tools

- **Website Carbon Calculator** - https://www.websitecarbon.com/
- **EcoIndex** - https://www.ecoindex.fr/ (French tool)
- **Green Web Foundation** - https://www.thegreenwebfoundation.org/
- **Ecograder** - https://ecograder.com/
- **Beacon** - https://digitalbeacon.co/

### Guidelines

- **Sustainable Web Design** - https://sustainablewebdesign.org/
- **W3C Sustainable Web** - https://www.w3.org/community/sustyweb/
- **Green Software Foundation** - https://greensoftware.foundation/

### Green Hosting

- **Green Web Directory** - https://www.thegreenwebfoundation.org/directory/
- **GreenGeeks** - https://www.greengeeks.com/
- **Infomaniak** - https://www.infomaniak.com/

### Books & Reading

- *Sustainable Web Design* by Tom Greenwood
- *Designing for Sustainability* by Tim Frick
- *World Wide Waste* by Gerry McGovern

---

## Key Takeaways

1. **Every byte matters** - 0.5g CO₂ per MB adds up
2. **Images are the biggest opportunity** - 50-60% of page weight
3. **Green hosting matters** - 80% carbon reduction
4. **Performance = Sustainability** - Faster is greener
5. **Continuous monitoring** - Prevent regression
6. **Educate your team** - Make it part of culture

**Remember:** Digital sustainability is not just environmental - it's also better UX, lower costs, and improved accessibility.
