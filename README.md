# Serum Plugins Official

Official Serum plugins for Claude Code - modular tools for crawling, security, and media processing.

## Installation

### Add the marketplace

```bash
/plugin marketplace add leobrival/serum-plugins-official
```

### Install plugins

```bash
# Install the crawler plugin
/plugin install crawler@serum-plugins-official

# Install hookify (24 security rules, Bun runtime)
/plugin install hookify@serum-plugins-official

# Install media-tools (image/video processing)
/plugin install media-tools@serum-plugins-official

# Install audit-checker (multi-domain audits)
/plugin install audit-checker@serum-plugins-official
```

### Verify installation

```bash
/plugin list
```

## Available Plugins

### crawler

High-performance web crawler for discovering and mapping website structure.

**Features:**

- Sitemap discovery and parsing
- Checkpoint/resume support
- Rate limiting
- HTML report generation

**Usage:**

```bash
/crawler https://example.com
```

### hookify

Enhanced hookify with **24 pre-configured security rules** - uses Bun runtime, no Python required.

**Features:**

- 20 Bash security rules (block/warn dangerous commands)
- 4 File editing rules (secrets detection, debug code, TODOs)
- Simple markdown format for custom rules
- Commands: `/hookify`, `/hookify:list`, `/hookify:configure`
- **Bun runtime** - Fast TypeScript execution, no dependencies

**Quick example:**

```bash
/hookify Block npm publish commands
```

### media-tools

Smart image and video processing with **auto-detection** of single files or batch operations.

**Features:**

- Auto-detects single file or batch (folder/pattern)
- Resize, crop, compress images with aspect ratio control
- Modern formats support (WebP, AVIF, VP9/WebM)
- Video compression, conversion, and trimming
- Optimized GIF creation from videos or image sequences

**Commands:**

- `/media` - Universal processor (auto-detects image/video)
- `/image` - Smart image processing (resize, compress, convert)
- `/video` - Smart video processing (compress, convert, trim)
- `/gif` - Create optimized GIFs

**Examples:**

```bash
# Process any media (auto-detect)
/media ./downloads/

# Single image
/image photo.jpg --Resolution 1920 --Ratio 16:9 --Format webp

# Batch images
/image ./photos/ --Format webp --Output subfolder

# Compress video
/video video.mov --Resolution 1080p --Format mp4

# Create GIF
/gif video.mp4 --Duration 5 --Width 480
```

### audit-checker

Multi-domain audit suite for comprehensive web application analysis covering **accessibility, security, performance, and eco-design**.

**4 Audit Domains:**

1. **Accessibility (RGAA 4.1)** - French accessibility standards compliance
2. **Security (OWASP Top 10)** - Vulnerability detection and code analysis
3. **Performance (Core Web Vitals)** - Lighthouse metrics and optimization
4. **Eco-Design** - Digital sustainability and carbon footprint

**Features:**

- **Slash Commands:** `/audit`, `/audit-a11y`, `/audit-security`, `/audit-performance`, `/audit-eco`
- **Specialized Agents:** Expert agents for each audit domain
- **Comprehensive Methodology:** Skill with detailed reference documentation
- **3-Level Fallback:** CLI tools → Chrome DevTools MCP → Manual analysis
- **Markdown Reports:** Structured reports with severity levels and actionable recommendations

**Commands:**

```bash
# Complete multi-domain audit
/audit https://example.com

# Single domain audits
/audit-a11y https://example.com              # Accessibility (RGAA 4.1)
/audit-security ./project                    # Security (OWASP Top 10)
/audit-performance https://example.com --device mobile
/audit-eco https://example.com

# With specialized agents
# "Use the a11y-auditor agent to analyze this page"
# "Use the security-auditor to review authentication flow"
```

**Report Format:**

- **Severity Levels:** ERROR, WARNING, INFO, PASS
- **Domain Scores:** 0-100 rating per audit domain
- **Actionable Recommendations:** Prioritized fix suggestions with code examples
- **Standards Compliance:** RGAA 4.1, WCAG 2.1, OWASP Top 10 2021, Core Web Vitals

**Output Location:**

```
./audits/
├── audit-{timestamp}.md           # Full multi-domain report
├── a11y-{timestamp}.md            # Accessibility report
├── security-{timestamp}.md        # Security report
├── performance-{timestamp}.md     # Performance report
└── eco-{timestamp}.md             # Eco-design report
```

## File Structure

```
serum-plugins-official/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── crawler/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── crawler.md
│   │   ├── scripts/
│   │   └── README.md
│   ├── hookify/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── core/              # TypeScript rule engine
│   │   ├── hooks/             # Bun hooks
│   │   ├── commands/
│   │   ├── rules/             # 24 pre-configured security rules
│   │   └── README.md
│   ├── media-tools/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   ├── media.md      # Universal processor
│   │   │   ├── image.md      # Smart image processing
│   │   │   ├── video.md      # Smart video processing
│   │   │   └── gif.md        # GIF creation
│   │   └── README.md
│   └── audit-checker/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   ├── audit.md              # Multi-domain orchestrator
│       │   ├── audit-a11y.md         # Accessibility audit
│       │   ├── audit-security.md     # Security audit
│       │   ├── audit-performance.md  # Performance audit
│       │   └── audit-eco.md          # Eco-design audit
│       ├── agents/
│       │   ├── a11y-auditor.md       # Accessibility expert
│       │   ├── security-auditor.md   # Security specialist
│       │   ├── performance-auditor.md # Performance expert
│       │   └── eco-auditor.md        # Eco-design specialist
│       ├── skills/
│       │   └── audit-methodology/
│       │       ├── SKILL.md          # Audit methodology
│       │       └── reference/
│       │           ├── rgaa-criteria.md    # RGAA 4.1 reference
│       │           ├── owasp-top10.md      # OWASP Top 10
│       │           ├── cwv-metrics.md      # Core Web Vitals
│       │           └── eco-checklist.md    # Eco-design checklist
│       └── README.md
└── README.md
```

## Development

### Adding New Plugins

Create a new directory under `plugins/` with the following structure:

```
plugins/my-new-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── agents/
├── hooks/
└── README.md
```

Then add the plugin entry to `.claude-plugin/marketplace.json`.

## License

This project uses a **dual licensing** model:

### Open Source - AGPL-3.0

For open source projects and personal use, Serum Plugins Official is available
under the [GNU Affero General Public License v3.0](LICENSE).

This means:

- You can use, modify, and distribute the software freely
- Any modifications or derivative works must also be open source under AGPL-3.0
- If you run a modified version as a network service, you must provide source code

### Commercial License

For proprietary/commercial use without AGPL-3.0 obligations, a commercial
license is available. See [LICENSE-COMMERCIAL](LICENSE-COMMERCIAL) for details.

**When you need a commercial license:**

- Using plugins in closed-source products
- Integrating into proprietary SaaS platforms
- Distributing without AGPL-3.0 source code requirements

**Contact:** leobrival@serumandco.com for commercial licensing inquiries
