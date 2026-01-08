---
name: image-processing
description: Smart image processing for resize, compress, and convert operations with batch support. Use when users ask to resize images, compress photos, convert to WebP/AVIF, batch process images, optimize for social media, or create image thumbnails. Supports modern formats and aspect ratios.
---

# Image Processing

Smart image processor with automatic single-file and batch operation detection, modern format support, and social media presets.

## Quick Start

Process images with optimal defaults:

```bash
cd ~/.claude/scripts/media-tools
bun run image photo.jpg --Format webp --Quality 85
```

## Intelligent Behavior

Automatically detects input type and adjusts processing:

| Input | Behavior |
|-------|----------|
| Single file (`photo.jpg`) | Process that file |
| Directory (`./photos/`) | Process all images in directory |
| Glob pattern (`*.png`) | Process matching files |
| Multiple files | Process each file |

## CLI Options

| Option | Default | Options | Description |
|--------|---------|---------|-------------|
| Resolution | `original` | original, 3840, 2560, 1920, 1280, 800, 640, custom | Target width in pixels |
| Ratio | `original` | original, 16:9, 9:16, 3:2, 1:1, 4:5, 4:3, 21:9 | Aspect ratio (crops to fit) |
| Format | `webp` | original, webp, jpg, png, avif | Output format |
| Quality | `85` | 95, 85, 75, 65, 55, 45 | Quality level (1-100) |
| Output | `same` | same, subfolder, custom | Output location |

## Features

**Format Support**:
- **WebP** - Best compression/quality ratio (recommended)
- **AVIF** - Next-gen format, excellent compression
- **JPG** - Universal compatibility
- **PNG** - Lossless, supports transparency

**Smart Processing**:
- Preserves original files (creates new output)
- Strips metadata for smaller files
- Maintains aspect ratio or crops to specified ratio
- Handles batch operations efficiently

**Supported Input Formats**:
jpg, jpeg, png, gif, webp, tiff, avif, bmp, heic

## Usage Examples

### Single file - resize and convert

```bash
bun run image photo.jpg --Resolution 1920 --Ratio 16:9 --Format webp
```

### Single file - compress only

```bash
bun run image photo.jpg --Format webp --Quality 75
```

### Batch - entire folder

```bash
bun run image ./photos/ --Resolution 1280 --Format webp --Output subfolder
```

Shows preview before processing:
```
Found 24 images to process:
- photo1.jpg (2.4 MB)
- photo2.png (1.8 MB)
- ... and 22 more

Settings:
- Resolution: 1280 (original → 1280px width)
- Ratio: original (keep aspect ratio)
- Format: webp
- Quality: 85%
- Output: ./photos/processed/

Proceed? [Yes/No]
```

### Batch - specific files

```bash
bun run image "*.png" --Format webp --Quality 85
```

### Instagram post (1:1 ratio)

```bash
bun run image ./uploads/ --Resolution 1280 --Ratio 1:1 --Format jpg
```

### Instagram story (9:16 ratio)

```bash
bun run image ./content/ --Resolution 1080 --Ratio 9:16 --Format jpg --Quality 90
```

## Social Media Presets

| Platform | Resolution | Ratio | Format | Quality | Use Case |
|----------|------------|-------|--------|---------|----------|
| Web hero | 1920 | 16:9 | webp | 85 | Hero images |
| Thumbnail | 640 | 16:9 | webp | 75 | Grid thumbnails |
| Instagram post | 1280 | 1:1 | jpg | 85 | Feed posts |
| Instagram story | 1080 | 9:16 | jpg | 85 | Stories/Reels |
| Twitter/X | 1280 | 16:9 | jpg | 85 | Tweets with images |
| LinkedIn | 1920 | 1.91:1 | jpg | 85 | Posts |
| OG image | 1200 | 1.91:1 | jpg | 85 | Social sharing |
| 4K wallpaper | 3840 | 16:9 | png | 95 | Desktop backgrounds |

## Processing Modes

### With resize and crop (when ratio specified)

```bash
magick input.jpg \
  -resize 1920x1080^ \
  -gravity center \
  -extent 1920x1080 \
  -quality 85 \
  -strip \
  output.webp
```

### Compress only (original dimensions)

```bash
magick input.jpg \
  -quality 85 \
  -strip \
  output.webp
```

### Resize without crop (original ratio)

```bash
magick input.jpg \
  -resize 1920x \
  -quality 85 \
  -strip \
  output.webp
```

## Aspect Ratio Calculations

When a ratio is specified, height is calculated automatically:

| Ratio | Calculation | Example (width=1920) |
|-------|-------------|----------------------|
| 16:9 | height = width × 9/16 | 1080px |
| 9:16 | height = width × 16/9 | 3413px |
| 3:2 | height = width × 2/3 | 1280px |
| 1:1 | height = width | 1920px |
| 4:5 | height = width × 5/4 | 2400px |
| 4:3 | height = width × 3/4 | 1440px |
| 21:9 | height = width × 9/21 | 823px |

## Processing Results

After batch processing, shows detailed report:

```
✓ Processed 24 images

Summary:
- Total input:  45.2 MB
- Total output: 12.8 MB
- Compression:  72% smaller
- Time:         1.2s

Output: ./processed/
```

## Best Practices

1. **Use WebP for web** - 30% smaller than JPG with same quality
2. **Keep originals** - Tool never modifies source files
3. **Quality 85** - Sweet spot for most use cases
4. **Add dimensions** - Prevent layout shifts on web
5. **Test compression** - Start with Quality 85, adjust if needed
6. **Batch wisely** - Process similar images together
7. **Use ratios for social** - Consistent sizing across platforms

## Requirements

- **ImageMagick 7+** - Uses `magick` command
- Install: `brew install imagemagick`

## Related Files

- **Command**: `plugins/media-tools/commands/image.md`
- **Media Processor**: `plugins/media-tools/skills/media-processor/`
- **Video Processing**: `plugins/media-tools/skills/video-processing/`
