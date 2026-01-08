---
name: video-processing
description: Smart video processing for compress, convert, trim, and audio extraction with batch support. Use when users ask to compress videos, convert to MP4/WebM, extract video clips, trim videos, remove audio, extract audio tracks, or batch process video files. Supports modern codecs and social media presets.
---

# Video Processing

Smart video processor with automatic single-file and batch operation detection, modern codec support, and platform-specific presets.

## Quick Start

Process videos with optimal defaults:

```bash
cd ~/.claude/scripts/media-tools
bun run video video.mov --Resolution 1080p --Format mp4
```

## Intelligent Behavior

Automatically detects input type and adjusts processing:

| Input | Behavior |
|-------|----------|
| Single file (`video.mp4`) | Process that file |
| Directory (`./videos/`) | Process all videos in directory |
| Glob pattern (`*.mov`) | Process matching files |
| Multiple files | Process each file |

## CLI Options

| Option | Default | Options | Description |
|--------|---------|---------|-------------|
| Resolution | `original` | original, 4K, 1440p, 1080p, 720p, 480p, custom | Target resolution |
| Format | `mp4` | original, mp4, webm, mov, gif | Output format |
| Quality | `medium` | high, medium, low, web | Quality preset |
| FPS | `original` | original, 60, 30, 24, 15 | Target frame rate |
| Trim | `full` | full, custom | Trim video to clip |
| Audio | `keep` | keep, remove, extract | Audio handling |
| Output | `same` | same, subfolder, custom | Output location |

## Features

**Format Support**:
- **MP4/H.264** - Universal compatibility (recommended)
- **WebM/VP9** - Better compression, web-optimized
- **MOV** - Apple ecosystem
- **GIF** - Animated preview

**Smart Processing**:
- Preserves original files (creates new output)
- Auto-selects optimal codec settings
- Handles batch operations with progress tracking
- Shows estimated output size before processing

**Supported Input Formats**:
mp4, mov, avi, mkv, webm, m4v, flv, wmv, mts

## Usage Examples

### Single file - compress

```bash
bun run video video.mov --Resolution 1080p --Format mp4 --Quality medium
```

### Single file - convert to web format

```bash
bun run video video.mov --Format webm --Quality web
```

### Single file - extract clip

```bash
bun run video video.mp4 --Trim custom --Resolution 720p
```

Prompts for timing:
```
Enter start time (HH:MM:SS or seconds): 00:01:30
Enter duration (HH:MM:SS or seconds, or 'end' for rest): 00:00:30
```

### Single file - create GIF preview

```bash
bun run video video.mp4 --Format gif --Resolution 480p --FPS 15
```

### Batch - compress folder

```bash
bun run video ./raw/ --Resolution 1080p --Format mp4 --Output subfolder
```

Shows preview before processing:
```
Found 8 videos to process:
- intro.mov (1:24, 4K, 2.1 GB)
- clip1.mp4 (0:45, 1080p, 340 MB)
- clip2.mp4 (2:10, 1080p, 890 MB)
- ... and 5 more

Total duration: 12:34
Total size: 5.8 GB

Settings:
- Resolution: 1080p
- Format: mp4 (H.264)
- Quality: medium (CRF 23)
- FPS: original
- Audio: keep

Estimated output: ~1.2 GB (80% smaller)

Proceed? [Yes/No]
```

### Batch - convert all MOV to MP4

```bash
bun run video "*.mov" --Format mp4 --Quality medium
```

### Remove audio from videos

```bash
bun run video ./videos/ --Audio remove --Format mp4
```

### Extract audio tracks

```bash
bun run video ./videos/ --Audio extract
```

Outputs `.m4a` files alongside videos.

## Platform Presets

| Platform | Resolution | Format | Quality | FPS | Use Case |
|----------|------------|--------|---------|-----|----------|
| YouTube upload | 1080p | mp4 | high | original | High quality |
| Twitter/X | 720p | mp4 | medium | 30 | Short clips |
| Instagram Reel | 1080p | mp4 | medium | 30 | Vertical video |
| TikTok | 1080p | mp4 | medium | 30 | Short form |
| Web background | 720p | webm | low | 24 | Hero videos |
| Email attachment | 480p | mp4 | low | 24 | Small size |
| GIF preview | 480p | gif | - | 15 | Animated preview |
| Archival | original | mp4 | high | original | Preservation |

## Quality Settings

Maps quality presets to codec parameters:

| Quality | H.264 CRF | VP9 CRF | Description |
|---------|-----------|---------|-------------|
| high | 18 | 24 | Archival, minimal loss |
| medium | 23 | 30 | Balanced (default) |
| low | 28 | 36 | Smaller files |
| web | 30 | 38 | Streaming optimized |

**CRF (Constant Rate Factor)**: Lower = better quality, larger file

## Resolution Mapping

| Preset | Width | Height | Aspect Ratio |
|--------|-------|--------|--------------|
| 4K | 3840 | 2160 | 16:9 |
| 1440p | 2560 | 1440 | 16:9 |
| 1080p | 1920 | 1080 | 16:9 |
| 720p | 1280 | 720 | 16:9 |
| 480p | 854 | 480 | 16:9 |

## Processing Commands

### MP4 (H.264) - Standard

```bash
ffmpeg -i input.mov \
  -vf "scale=1920:-2" \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -c:a aac -b:a 128k \
  output.mp4
```

### WebM (VP9) - Web Optimized

```bash
ffmpeg -i input.mov \
  -vf "scale=1920:-2" \
  -c:v libvpx-vp9 \
  -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  output.webm
```

### With Trim

```bash
ffmpeg -ss 00:01:30 -t 00:00:30 -i input.mp4 \
  -vf "scale=1920:-2" \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -c:a aac -b:a 128k \
  output.mp4
```

### Remove Audio

```bash
ffmpeg -i input.mp4 -an \
  -vf "scale=1920:-2" \
  -c:v libx264 \
  -crf 23 \
  output.mp4
```

### Extract Audio Only

```bash
ffmpeg -i input.mp4 \
  -vn \
  -c:a aac \
  -b:a 192k \
  output.m4a
```

## Processing Results

Shows real-time progress for each file:

```
[1/8] intro.mov → intro.mp4
      4K → 1080p | 2.1 GB → 245 MB (88% smaller)
      ████████████████████████████░░ 90% | ETA: 0:15

[2/8] clip1.mp4 → clip1_compressed.mp4
      1080p → 1080p | 340 MB → 89 MB (74% smaller)
...

✓ Processed 8 videos

Summary:
- Total input:  5.8 GB
- Total output: 1.1 GB
- Compression:  81% smaller
- Time:         4m 32s

Output: ./processed/
```

## Best Practices

1. **Use MP4/H.264** - Universal compatibility across all devices
2. **Quality "medium"** - Best balance for most use cases
3. **Keep originals** - Tool never modifies source files
4. **Test on sample** - Process one file first to verify settings
5. **Trim before compressing** - Reduces processing time
6. **Match platform specs** - Use presets for target platform
7. **Audio bitrate 128k** - Sufficient for most speech/music

## Audio Handling

| Option | Behavior | Use Case |
|--------|----------|----------|
| `keep` | Preserve audio track | Standard videos |
| `remove` | Strip audio completely | Silent background videos |
| `extract` | Save audio as separate file | Audio-only content |

## Requirements

- **FFmpeg** - With libx264, libvpx-vp9, libopus codecs
- Install: `brew install ffmpeg`

Verify codecs:
```bash
ffmpeg -codecs | grep -E "h264|vp9|opus"
```

## Related Files

- **Command**: `plugins/media-tools/commands/video.md`
- **Media Processor**: `plugins/media-tools/skills/media-processor/`
- **GIF Creation**: `plugins/media-tools/skills/gif-creation/`
- **Image Processing**: `plugins/media-tools/skills/image-processing/`
