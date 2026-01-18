---
description: Eco-design audit for environmental impact and digital sustainability
allowed-tools: Bash, Read, Write, Glob, Task, mcp__chrome-devtools__*
argument-hint: <url_or_path> [--output ./audits/]
arguments:
  - name: Target
    default: ""
  - name: OutputDir
    default: "./audits"
---

# Eco-Design Audit (Digital Sustainability)

Performs eco-design audit to assess environmental impact and digital sustainability of web applications.

## Arguments

- **Target** ($TARGET): Website URL or local project path to audit
- **OutputDir** ($OUTPUT_DIR): Directory for audit report (default: "./audits")

## Task

You are an eco-design auditor specializing in digital sustainability and Green IT practices.

### Step 1: Preparation

```bash
# Create output directory
mkdir -p $OUTPUT_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_FILE="$OUTPUT_DIR/eco-$TIMESTAMP.md"

# Detect target type
if [[ $TARGET =~ ^https?:// ]]; then
  TARGET_TYPE="url"
else
  TARGET_TYPE="path"
fi
```

### Step 2: Execute Eco-Design Audit

#### For URL Targets

Use Chrome DevTools MCP or Lighthouse to collect data:

```typescript
// Navigate to URL
mcp__chrome-devtools__navigate_page({ url: $TARGET })

// Get network data
const requests = mcp__chrome-devtools__list_network_requests()

// Calculate:
// - Total page weight
// - Number of HTTP requests
// - Image/video sizes
// - Third-party scripts

// Take performance trace for CPU usage
mcp__chrome-devtools__performance_start_trace({ reload: true })
```

Run Lighthouse if available:

```bash
if command -v lighthouse &> /dev/null; then
  lighthouse $TARGET \
    --output json \
    --output-path $OUTPUT_DIR/lighthouse-eco-$TIMESTAMP.json
fi
```

#### For Local Project Paths

Analyze codebase for eco-design patterns:

```bash
cd $TARGET

# Count lines of code
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  -exec wc -l {} + | awk '{sum+=$1} END {print sum}' \
  > $OUTPUT_DIR/loc-count.txt

# Find large media files
find . -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp4" -o -name "*.webm" \) \
  -size +100k \
  ! -path "*/node_modules/*" \
  -exec ls -lh {} + \
  > $OUTPUT_DIR/large-media.txt

# Check for modern image formats
find . -name "*.webp" -o -name "*.avif" | wc -l > $OUTPUT_DIR/modern-formats.txt

# Count dependencies
if [ -f "package.json" ]; then
  jq '.dependencies | length' package.json > $OUTPUT_DIR/dep-count.txt
  jq '.devDependencies | length' package.json > $OUTPUT_DIR/devdep-count.txt
fi

# Check for tree shaking config
grep -r "sideEffects" package.json || echo "No tree shaking config"

# Find unused dependencies
npx depcheck --json > $OUTPUT_DIR/depcheck.json 2>/dev/null || true
```

### Step 3: Analyze by Eco-Design Criteria

#### 1. Page Weight Optimization

**Metrics:**
- Total page weight (target: < 1 MB)
- Image weight (target: < 500 KB)
- JavaScript weight (target: < 300 KB)
- CSS weight (target: < 50 KB)
- Number of requests (target: < 50)

**Analysis:**
```
Carbon footprint estimate = Page weight (MB) × 0.5g CO₂ per MB × Page views
```

#### 2. Resource Efficiency

Check for:
- Unused JavaScript (% of dead code)
- Unused CSS (% of unused rules)
- Unoptimized images (missing WebP/AVIF)
- Redundant dependencies
- Duplicate code

#### 3. Loading Strategy

Check for:
- Lazy loading for images/videos
- Code splitting
- Tree shaking enabled
- Dynamic imports
- Service worker caching

#### 4. Media Optimization

Check for:
- Modern image formats (WebP, AVIF)
- Responsive images (srcset)
- Video compression
- Adaptive bitrate streaming
- Efficient encoding

#### 5. Hosting & Infrastructure

Check for:
- CDN usage
- HTTP/2 or HTTP/3
- Compression (gzip/brotli)
- Cache headers
- Green hosting provider

#### 6. Code Efficiency

Check for:
- Algorithmic complexity
- Memory leaks
- Excessive re-renders
- Heavy computations in main thread
- Efficient data structures

#### 7. User Experience

Check for:
- Dark mode support (reduces screen energy)
- Reduced motion support
- Content-first approach
- Progressive enhancement

#### 8. Third-Party Scripts

Check for:
- Number of third-party domains
- Analytics/tracking scripts
- Social media widgets
- Ad networks
- Unnecessary dependencies

### Step 4: Calculate Eco-Design Score

```
Score = Weighted average of criteria:
- Page Weight (20%)
- Resource Efficiency (20%)
- Loading Strategy (15%)
- Media Optimization (15%)
- Code Efficiency (10%)
- Hosting (10%)
- UX (5%)
- Third-Party (5%)
```

Sustainability levels:

- **≥ 85** - Excellent (Green)
- **70-84** - Good (Light Green)
- **50-69** - Acceptable (Yellow)
- **< 50** - Poor (Red)

### Step 5: Estimate Carbon Footprint

Calculate annual CO₂ emissions:

```
Annual CO₂ = Page weight (MB) × Monthly visitors × 12 months × 0.5g CO₂/MB

Example:
2 MB × 100,000 visitors/month × 12 × 0.5g = 1,200 kg CO₂/year
```

Compare to real-world equivalents:
- kg CO₂ = X trees needed to offset
- kg CO₂ = X km driven by car

### Step 6: Generate Report

Write Markdown report to `$REPORT_FILE`:

```markdown
# Eco-Design Audit Report

**Target:** $TARGET
**Date:** {date}
**Framework:** Green IT / Digital Sustainability

## Executive Summary

- **Eco-Design Score:** XX/100
- **Sustainability Level:** [Excellent/Good/Acceptable/Poor]
- **Page Weight:** XXX KB
- **Estimated CO₂/visit:** X.XXg
- **Annual CO₂ (100k visitors/month):** XXX kg

### Environmental Impact

🌍 **Annual carbon footprint equivalent to:**
- X trees needed for carbon offset
- X km driven by an average car
- X hours of streaming video

## Page Weight Analysis

| Resource Type | Size | % of Total | Target | Status |
|---------------|------|------------|--------|--------|
| HTML | XX KB | X% | < 50 KB | ✅/❌ |
| CSS | XX KB | X% | < 50 KB | ✅/❌ |
| JavaScript | XX KB | X% | < 300 KB | ✅/❌ |
| Images | XX KB | X% | < 500 KB | ✅/❌ |
| Fonts | XX KB | X% | < 100 KB | ✅/❌ |
| Videos | XX KB | X% | Varies | ✅/❌ |
| **Total** | **XXX KB** | **100%** | **< 1 MB** | ✅/❌ |

**HTTP Requests:** XX (target: < 50)

## Eco-Design Criteria Assessment

### 🌱 1. Resource Efficiency (Score: XX/100)

#### Issues
- ❌ Unused JavaScript: XXX KB (XX% of total JS)
- ❌ Unused CSS: XX KB (XX% of total CSS)
- ⚠️ Duplicate dependencies detected
- ✅ Tree shaking enabled

#### Recommendations
1. Remove unused code
2. Implement code splitting
3. Enable tree shaking

### 🖼️ 2. Media Optimization (Score: XX/100)

#### Issues
- ❌ No modern formats: X images not using WebP/AVIF
- ❌ No lazy loading on X images
- ⚠️ Large images: X images > 100 KB

#### Image Inventory
| Image | Size | Format | Recommendation |
|-------|------|--------|----------------|
| hero.jpg | XXX KB | JPEG | Convert to WebP, save XX KB |
| logo.png | XX KB | PNG | Convert to SVG |

#### Recommendations
1. Convert images to WebP/AVIF
2. Implement lazy loading
3. Use responsive images (srcset)
4. Compress images further

### ⚡ 3. Loading Strategy (Score: XX/100)

#### Issues
- ❌ No code splitting detected
- ❌ Blocking resources: X files
- ✅ Service worker present

#### Recommendations
1. Implement dynamic imports
2. Use async/defer for scripts
3. Enable HTTP/2 push

### 🏗️ 4. Infrastructure (Score: XX/100)

#### Issues
- ✅ CDN in use: [CDN name]
- ✅ Compression enabled: brotli
- ❌ HTTP/1.1 only (upgrade to HTTP/2)
- ⚠️ Cache headers suboptimal

#### Recommendations
1. Enable HTTP/2 or HTTP/3
2. Optimize cache headers
3. Consider green hosting provider

### 💻 5. Code Efficiency (Score: XX/100)

#### Issues
- Lines of code: XXX (minimize complexity)
- Dependencies: XX (evaluate necessity)
- Unused dependencies: X packages

#### Recommendations
1. Remove unused dependencies
2. Refactor complex algorithms
3. Optimize database queries

### 📱 6. User Experience (Score: XX/100)

#### Issues
- ✅ Dark mode supported
- ✅ Reduced motion supported
- ⚠️ Content above the fold: XXX KB

#### Recommendations
1. Implement content-first approach
2. Prioritize critical content

### 🔌 7. Third-Party Scripts (Score: XX/100)

#### Issues
- Third-party domains: X
- Analytics scripts: X
- Social media widgets: X
- Total third-party weight: XXX KB

#### Third-Party Inventory
| Script | Size | Purpose | Necessary? |
|--------|------|---------|------------|
| google-analytics.js | XX KB | Analytics | ⚠️ Consider alternatives |
| facebook-pixel.js | XX KB | Marketing | ❌ Remove if not essential |

#### Recommendations
1. Reduce third-party scripts
2. Self-host analytics
3. Use facade pattern for social widgets

## Comparison to Industry Benchmarks

| Metric | Your Site | Industry Avg | Best Practice |
|--------|-----------|--------------|---------------|
| Page Weight | XXX KB | 2000 KB | < 1000 KB |
| HTTP Requests | XX | 70 | < 50 |
| CO₂/visit | X.XXg | 1.76g | < 1.0g |

## Carbon Footprint Reduction Plan

### Quick Wins (Immediate - Save XX% CO₂)

1. **Enable compression**
   - Estimated savings: XXX KB → XX g CO₂/visit

2. **Convert images to WebP**
   - Estimated savings: XXX KB → XX g CO₂/visit

3. **Remove unused code**
   - Estimated savings: XXX KB → XX g CO₂/visit

### High Impact (This Month - Save XX% CO₂)

1. **Implement lazy loading**
2. **Optimize images**
3. **Enable code splitting**

### Long-Term (This Year - Save XX% CO₂)

1. **Migrate to green hosting**
2. **Implement edge caching**
3. **Progressive enhancement**

## Sustainability Certifications

Consider pursuing:

- ✅ Website Carbon Badge (< 0.5g per visit)
- ⚠️ Green Web Foundation certification
- ⚠️ ISO 14001 Environmental Management

## Monitoring Recommendations

Set up continuous monitoring:

1. **Carbon tracking**: Use websitecarbon.com API
2. **Performance budgets**: Alert on weight increase
3. **Regular audits**: Monthly eco-design checks

## Next Steps

1. Implement quick wins (save XX g CO₂/visit)
2. Set performance budgets
3. Educate team on eco-design
4. Monitor carbon footprint monthly
5. Consider green hosting migration
6. Re-audit in 3 months

---
*Generated by audit-checker plugin on {timestamp}*
*Estimated CO₂ calculations based on 0.5g CO₂ per MB transferred*
```

### Step 7: Display Summary

```
🌱 Eco-Design Audit Complete

Eco-Design Score: XX/100
Sustainability: [Excellent/Good/Acceptable/Poor]

Page Weight: XXX KB
CO₂ per visit: X.XXg
Annual CO₂: XXX kg (≈ X trees needed)

Full report: $REPORT_FILE

Top 3 Optimization Opportunities:
1. [Opportunity] - Save XXX KB (XX g CO₂/visit)
2. [Opportunity] - Save XXX KB (XX g CO₂/visit)
3. [Opportunity] - Save XXX KB (XX g CO₂/visit)

Quick Wins:
- [Action] → Save XX% CO₂
- [Action] → Save XX% CO₂
```

## Execution Strategy

### For URLs

```bash
# 1. Use Chrome DevTools MCP for network analysis
# 2. Run Lighthouse if available
# 3. Calculate carbon footprint
# 4. Generate report
```

### For Local Projects

```bash
# 1. Analyze codebase structure
# 2. Check dependencies
# 3. Find large media files
# 4. Estimate bundle sizes
```

## Usage Examples

### Audit Website

```bash
/audit-eco https://example.com
```

### Audit Local Project

```bash
/audit-eco ./my-project
```

### Custom Output

```bash
/audit-eco https://example.com --output ./eco-reports/
```

## Eco-Design Reference

Use the skill reference file:

```bash
skills/audit-methodology/reference/eco-checklist.md
```

## Tools & Resources

- [Website Carbon Calculator](https://www.websitecarbon.com/)
- [EcoIndex](https://www.ecoindex.fr/)
- [Green Web Foundation](https://www.thegreenwebfoundation.org/)
- [Sustainable Web Design](https://sustainablewebdesign.org/)

## Notes

- Digital sector accounts for 4% of global greenhouse gas emissions
- Average web page emits 1.76g CO₂ per visit
- Optimizing for eco-design also improves performance
- Green hosting can reduce carbon footprint by 50-70%
- Every MB transferred = ~0.5g CO₂ emitted
