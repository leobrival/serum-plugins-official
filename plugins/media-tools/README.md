# Media Tools Plugin

Smart image and video processing with automatic batch detection.

## Features

- **Auto-detection**: Single file or batch processing
- **Smart defaults**: Optimal settings for each use case
- **Modern formats**: WebP, AVIF, VP9/WebM support
- **Flexible output**: Same folder, subfolder, or custom path

## Commands

| Command | Description |
|---------|-------------|
| `/media` | Universal processor - auto-detects images or videos |
| `/image` | Image processing - resize, compress, convert |
| `/video` | Video processing - compress, convert, trim |
| `/gif` | Create optimized GIFs from videos or images |

## Quick Start

```bash
# Add marketplace
/plugin marketplace add leobrival/serum-plugins-official

# Install media-tools
/plugin install media-tools@serum-plugins-official
```

## Usage Examples

### Process any media file or folder

```bash
# Auto-detect and process
/media ./downloads/

# Single file
/media photo.jpg

# Specific format
/media video.mov --Format mp4
```

### Image processing

```bash
# Resize and convert
/image photo.jpg --Resolution 1920 --Ratio 16:9 --Format webp

# Compress only
/image photo.jpg --Quality 75

# Batch process folder
/image ./photos/ --Format webp --Output subfolder

# Instagram ready (square)
/image ./uploads/ --Resolution 1280 --Ratio 1:1
```

### Video processing

```bash
# Compress video
/video video.mov --Resolution 1080p --Format mp4

# Convert for web
/video video.mp4 --Format webm --Quality web

# Trim clip
/video video.mp4 --Trim custom
# Then: start=00:01:30, duration=00:00:30

# Remove audio
/video video.mp4 --Audio remove
```

### Create GIFs

```bash
# Simple conversion
/gif video.mp4

# First 5 seconds
/gif video.mp4 --Duration 5 --Width 480

# High quality
/gif video.mp4 --Width 800 --FPS 24 --Optimize quality

# From image sequence
/gif ./frames/ --FPS 24
```

## Argument Reference

### /media

| Argument | Options | Default |
|----------|---------|---------|
| Action | auto, compress, resize, convert, info | auto |
| Quality | 95, 85, 75, 65, 55 | 85 |
| Format | auto, webp, jpg, png, mp4, webm, gif | auto |
| Output | same, subfolder, custom | same |

### /image

| Argument | Options | Default |
|----------|---------|---------|
| Resolution | original, 3840, 2560, 1920, 1280, 800, 640 | original |
| Ratio | original, 16:9, 9:16, 3:2, 1:1, 4:5, 4:3, 21:9 | original |
| Format | original, webp, jpg, png, avif | webp |
| Quality | 95, 85, 75, 65, 55, 45 | 85 |
| Output | same, subfolder, custom | same |

### /video

| Argument | Options | Default |
|----------|---------|---------|
| Resolution | original, 4K, 1440p, 1080p, 720p, 480p | original |
| Format | original, mp4, webm, mov, gif | mp4 |
| Quality | high, medium, low, web | medium |
| FPS | original, 60, 30, 24, 15 | original |
| Trim | full, custom | full |
| Audio | keep, remove, extract | keep |
| Output | same, subfolder, custom | same |

### /gif

| Argument | Options | Default |
|----------|---------|---------|
| Width | 800, 640, 480, 320, 240 | 480 |
| FPS | 30, 24, 20, 15, 12, 10 | 15 |
| Duration | full, 10, 5, 3, custom | full |
| Start | 0, custom | 0 |
| Loop | infinite, once, custom | infinite |
| Optimize | quality, balanced, size | balanced |

## Presets

### Social Media Images

| Platform | Resolution | Ratio | Format |
|----------|------------|-------|--------|
| Instagram Post | 1080 | 1:1 | jpg |
| Instagram Story | 1080 | 9:16 | jpg |
| Twitter/X | 1280 | 16:9 | jpg |
| LinkedIn | 1200 | 1.91:1 | jpg |
| OG/Share | 1200 | 1.91:1 | jpg |

### Social Media Videos

| Platform | Resolution | Format | Quality |
|----------|------------|--------|---------|
| YouTube | 1080p | mp4 | high |
| Instagram Reel | 1080p | mp4 | medium |
| TikTok | 1080p | mp4 | medium |
| Twitter/X | 720p | mp4 | medium |

## Requirements

- **ImageMagick 7+**: `brew install imagemagick`
- **FFmpeg**: `brew install ffmpeg`
- **gifsicle** (optional): `brew install gifsicle`

## How It Works

1. **Input analysis**: Detects file type (image/video) and count (single/batch)
2. **Preview**: Shows what will be processed and estimated output
3. **Processing**: Applies transformations with progress reporting
4. **Summary**: Reports compression ratios and output locations

## License

MIT
