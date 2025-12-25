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
│   └── media-tools/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   ├── media.md      # Universal processor
│       │   ├── image.md      # Smart image processing
│       │   ├── video.md      # Smart video processing
│       │   └── gif.md        # GIF creation
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

MIT
