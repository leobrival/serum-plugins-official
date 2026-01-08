---
name: media-processor
description: Universal media processor that auto-detects and processes images or videos with appropriate tools. Use when users ask to process media files, batch convert media, compress mixed folders, auto-detect file types, or handle both images and videos together.
---

# Media Processor

Universal media processing skill that automatically detects file types (images or videos) and applies appropriate processing with optimal settings.

## Quick Start

Process any media file or folder:

```bash
cd ~/.claude/scripts/media-tools
bun run media ./folder/
```

## Intelligent Detection

The processor analyzes input and automatically determines:

1. **File type** - Image or video
2. **Operation mode** - Single file or batch processing
3. **Best processing approach** - Based on file type and user intent

| Input Type | Detection | Action |
|------------|-----------|--------|
| `photo.jpg` | Image, single | Process with ImageMagick |
| `video.mp4` | Video, single | Process with FFmpeg |
| `./media/` | Mixed folder | Separate and process both types |
| `*.png` | Images, batch | Batch process all images |
| `*.mov` | Videos, batch | Batch process all videos |

## CLI Options

| Option | Default | Options | Description |
|--------|---------|---------|-------------|
| Action | `auto` | auto, compress, resize, convert, info | Processing action |
| Quality | `85` | 95, 85, 75, 65, 55 | Quality level (1-100) |
| Format | `auto` | auto, webp, jpg, png, avif, mp4, webm, gif | Output format |
| Output | `same` | same, subfolder, custom | Output location |

## Features

**Auto-Detection**:
- Identifies image extensions: jpg, jpeg, png, gif, webp, tiff, avif, bmp, heic
- Identifies video extensions: mp4, mov, avi, mkv, webm, m4v, flv, wmv

**Smart Processing**:
- Images: Compress to WebP by default (best quality/size ratio)
- Videos: Compress to MP4/H.264 (universal compatibility)
- Mixed folders: Processes images and videos separately with appropriate tools

**Actions Available**:
- `auto` - Analyzes and applies optimal compression/conversion
- `compress` - Reduces file size while maintaining quality
- `resize` - Changes dimensions (prompts for size)
- `convert` - Changes format only
- `info` - Shows metadata without modifications

## Usage Examples

### Process everything in folder

```bash
bun run media ./downloads/
```

Analyzes folder, shows summary:
```
Media Analysis:
───────────────
Location: ./downloads/

Found:
- 24 images (156 MB total)
  └ 18 JPG, 4 PNG, 2 WEBP
- 3 videos (2.1 GB total)
  └ 2 MP4, 1 MOV

Action: compress
Quality: 85
Format: auto (webp for images, mp4 for videos)

Proceed? [Yes/No]
```

### Compress single file

```bash
bun run media photo.jpg --Quality 75
```

### Convert format

```bash
bun run media video.mov --Action convert --Format mp4
```

### Get file info

```bash
bun run media video.mp4 --Action info
```

Output:
```
File: video.mp4
────────────────
Type: Video (H.264/AAC)
Size: 245 MB
Duration: 2:34
Resolution: 1920x1080
FPS: 30
Bitrate: 12.5 Mbps
Audio: AAC 128kbps stereo
Created: 2024-01-15 14:32
```

### Batch with custom output

```bash
bun run media ./raw/ --Quality 85 --Output subfolder
```

### Process specific types only

```bash
bun run media "*.png" --Format webp --Quality 85
```

## Action Mapping

| Action | Image Processing | Video Processing |
|--------|------------------|------------------|
| auto | Compress + convert to WebP | Compress to MP4 |
| compress | Reduce quality, keep dimensions | Reduce bitrate |
| resize | Scale to specified size | Scale to specified resolution |
| convert | Change format only | Change format only |
| info | Show metadata | Show metadata |

## Format Selection

**If Format is "auto"**:
- Images → WebP (best compression + quality ratio)
- Videos → MP4 (universal compatibility)
- GIF source → GIF (preserve animation)

**Manual format selection**:
- Images: webp, jpg, png, avif
- Videos: mp4, webm, mov
- Animations: gif

## Processing Results

After processing, shows comprehensive report:

```
✓ Processing Complete
──────────────────────

Images (24 files):
- Input:  156 MB
- Output: 42 MB (73% smaller)
- Format: JPG/PNG → WebP

Videos (3 files):
- Input:  2.1 GB
- Output: 480 MB (77% smaller)
- Format: MP4

Total savings: 1.73 GB (76% reduction)
Output: ./media/processed/
```

## Best Practices

1. **First time?** Just run with defaults - they work great for most cases
2. **Social media?** Use Quality 85 for good balance
3. **Archival?** Use Quality 95 with original format
4. **Web optimization?** Use Quality 75 with WebP/MP4
5. **Mixed folders?** Let auto-detection handle separation

## Requirements

- **ImageMagick 7+** - For image processing
- **FFmpeg** - For video processing
- Install: `brew install imagemagick ffmpeg`

## Related Files

- **Commands**: `plugins/media-tools/commands/media.md`
- **Image Skill**: `plugins/media-tools/skills/image-processing/`
- **Video Skill**: `plugins/media-tools/skills/video-processing/`
- **GIF Skill**: `plugins/media-tools/skills/gif-creation/`
