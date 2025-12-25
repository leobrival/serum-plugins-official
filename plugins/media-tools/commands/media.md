---
description: Universal media processor - auto-detects images or videos and applies appropriate processing
allowed-tools: [Bash, Read, Glob, AskUserQuestion]
argument-hint: <file_or_folder> [action]
arguments:
  - name: Action
    default: "auto"
    options: ["auto", "compress", "resize", "convert", "info"]
  - name: Quality
    default: "85"
    options: ["95", "85", "75", "65", "55"]
  - name: Format
    default: "auto"
    options: ["auto", "webp", "jpg", "png", "avif", "mp4", "webm", "gif"]
  - name: Output
    default: "same"
    options: ["same", "subfolder", "custom"]
---

# Media Command

Universal media processor that automatically detects file types and applies appropriate processing.

## Arguments

$ARGUMENTS

## Intelligent Detection

The command analyzes input and determines:

1. **File type** (image or video)
2. **Single or batch** operation
3. **Best processing approach**

| Input | Detection | Action |
|-------|-----------|--------|
| `photo.jpg` | Image, single | Process image |
| `video.mp4` | Video, single | Process video |
| `./media/` | Mixed folder | Separate and process both |
| `*.png` | Images, batch | Batch process images |
| `*.mov` | Videos, batch | Batch process videos |

## Task

### Step 1: Analyze Input

```bash
# Get file type
file_type=$(file --mime-type -b "$input")

# Categorize
if [[ "$file_type" == image/* ]]; then
  media_type="image"
elif [[ "$file_type" == video/* ]]; then
  media_type="video"
fi
```

**Image extensions:** jpg, jpeg, png, gif, webp, tiff, avif, bmp, heic
**Video extensions:** mp4, mov, avi, mkv, webm, m4v, flv, wmv, mts

### Step 2: Scan Directory (if folder)

```bash
images=($(find "$input" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.tiff" -o -iname "*.avif" \)))

videos=($(find "$input" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" -o -iname "*.mkv" -o -iname "*.webm" -o -iname "*.m4v" \)))
```

### Step 3: Show Summary

```
Media Analysis:
───────────────
Location: ./media/

Found:
- 24 images (156 MB total)
  └ 18 JPG, 4 PNG, 2 WEBP
- 3 videos (2.1 GB total)
  └ 2 MP4, 1 MOV

Action: compress
Quality: 85
Format: auto (webp for images, mp4 for videos)
Output: ./media/processed/

Proceed? [Yes/No]
```

### Step 4: Map Action to Processing

| Action | Image Processing | Video Processing |
|--------|------------------|------------------|
| auto | Compress + convert to WebP | Compress to MP4 |
| compress | Reduce quality, keep size | Reduce bitrate |
| resize | Scale to specified size | Scale to specified resolution |
| convert | Change format only | Change format only |
| info | Show metadata | Show metadata |

### Step 5: Determine Output Format

**If Format is "auto":**
- Images → WebP (best compression + quality)
- Videos → MP4 (universal compatibility)
- GIF source → GIF (preserve animation)

### Step 6: Process Files

**Images:**
```bash
magick "$input" -quality $quality -strip "$output.$format"
```

**Videos:**
```bash
ffmpeg -i "$input" -c:v libx264 -crf $crf -preset medium -c:a aac "$output.mp4"
```

### Step 7: Report Results

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

## Usage Examples

### Process everything in folder
```bash
/media ./downloads/
```

### Compress single file
```bash
/media photo.jpg --Action compress --Quality 75
```

### Convert format
```bash
/media video.mov --Action convert --Format mp4
```

### Get file info
```bash
/media video.mp4 --Action info
```

### Batch with custom output
```bash
/media ./raw/ --Quality 85 --Output subfolder
```

### Process specific types
```bash
/media "*.png" --Format webp --Quality 85
```

## Action Details

### auto (default)
- Analyzes each file
- Applies optimal compression
- Converts to modern formats
- Preserves quality

### compress
- Focuses on file size reduction
- Keeps original dimensions
- Adjusts quality settings
- Strips metadata

### resize
- Changes dimensions
- Prompts for target size
- Maintains aspect ratio (unless cropping)
- Applies quality settings

### convert
- Changes format only
- Minimal quality loss
- Preserves dimensions
- Fast processing

### info
- Shows file metadata
- Dimensions, duration, codec
- File size, creation date
- No modifications made

## Info Output Example

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

File: photo.jpg
────────────────
Type: Image (JPEG)
Size: 4.2 MB
Dimensions: 4032x3024
Color: sRGB
Bit depth: 8
Camera: iPhone 15 Pro
Created: 2024-01-15 10:24
```

## Requirements

- ImageMagick 7+ (for images)
- FFmpeg (for videos)
- Install: `brew install imagemagick ffmpeg`

## Tips

1. **First time?** Just run `/media ./folder/` - defaults work great
2. **Social media?** Use Quality 85 for good balance
3. **Archival?** Use Quality 95, original format
4. **Web optimization?** Use Quality 75, WebP/MP4
5. **Mixed folders?** Command handles images and videos separately
