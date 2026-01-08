---
name: gif-creation
description: Create optimized GIFs from videos or image sequences using 2-pass palette generation. Use when users ask to create GIF, video to GIF, optimize GIF, animated GIF, GIF from images, or reduce GIF file size. Supports quality presets and custom timing.
---

# GIF Creation

Create high-quality, optimized GIFs from videos or image sequences using FFmpeg's 2-pass palette generation technique.

## Quick Start

Create a GIF from video:

```bash
cd ~/.claude/scripts/media-tools
bun run gif video.mp4 --Width 480 --FPS 15
```

## Intelligent Behavior

Automatically detects source type and uses appropriate method:

| Input | Detection | Method |
|-------|-----------|--------|
| Video file (`video.mp4`) | Video source | FFmpeg 2-pass with palette |
| Image folder (`./frames/`) | Image sequence | FFmpeg or ImageMagick |
| Glob pattern (`frame_*.png`) | Image sequence | FFmpeg or ImageMagick |

## CLI Options

| Option | Default | Options | Description |
|--------|---------|---------|-------------|
| Width | `480` | 800, 640, 480, 320, 240 | Output width in pixels |
| FPS | `15` | 30, 24, 20, 15, 12, 10 | Frames per second |
| Duration | `full` | full, 10, 5, 3, custom | Video duration to convert |
| Start | `0` | 0, custom | Start time (seconds or HH:MM:SS) |
| Loop | `infinite` | infinite, once, custom | Loop behavior |
| Optimize | `balanced` | quality, balanced, size | Optimization preset |

## Features

**2-Pass Processing**:
- Pass 1: Generate optimized color palette
- Pass 2: Create GIF using palette
- Result: Better quality and smaller file size

**Optimization Presets**:
| Preset | Palette Mode | Dither | Colors | Best For |
|--------|--------------|--------|--------|----------|
| quality | full | floyd_steinberg | 256 | Photographs, gradients |
| balanced | diff | bayer:5 | 256 | General use (default) |
| size | single | none | 128 | Smallest files, simple graphics |

**Loop Options**:
- `infinite` - Loop forever (default, best for web)
- `once` - Play once and stop
- `custom` - Specify loop count

## Usage Examples

### Video to GIF - basic

```bash
bun run gif video.mp4
```

Default settings: 480px width, 15 FPS, full duration, infinite loop, balanced optimization.

### Video to GIF - first 5 seconds

```bash
bun run gif video.mp4 --Duration 5
```

### Video to GIF - custom clip

```bash
bun run gif video.mp4 --Start custom --Duration custom --Width 640
```

Prompts for timing:
```
Enter start time (HH:MM:SS or seconds): 00:00:30
Enter duration (seconds or HH:MM:SS): 10
```

### Video to GIF - small file size

```bash
bun run gif video.mp4 --Width 320 --FPS 12 --Optimize size
```

### Video to GIF - high quality

```bash
bun run gif video.mp4 --Width 800 --FPS 24 --Optimize quality
```

### Image sequence to GIF

```bash
bun run gif ./frames/ --FPS 24 --Width 640
```

### Image sequence - specific pattern

```bash
bun run gif "frame_*.png" --FPS 15 --Loop once
```

## Size Estimation

Approximate file sizes for different settings:

| Width | 5s @ 15fps | 10s @ 15fps | 5s @ 24fps | 10s @ 24fps |
|-------|------------|-------------|------------|-------------|
| 800px | 8-15 MB | 15-30 MB | 12-24 MB | 24-48 MB |
| 640px | 5-10 MB | 10-20 MB | 8-16 MB | 16-32 MB |
| 480px | 3-6 MB | 6-12 MB | 5-10 MB | 10-20 MB |
| 320px | 1-3 MB | 2-6 MB | 2-5 MB | 4-10 MB |
| 240px | 0.5-2 MB | 1-4 MB | 1-3 MB | 2-6 MB |

**Factors affecting size**:
- Width: Larger = bigger files
- FPS: More frames = bigger files
- Duration: Longer = bigger files
- Content: Complex scenes with motion = bigger files
- Optimize: quality > balanced > size

## Processing Preview

Before creating GIF, shows preview and confirmation:

```
Creating GIF from: video.mp4

Source:
- Duration: 0:15
- Resolution: 1920x1080
- FPS: 30

Output settings:
- Width: 480px (auto height: 270px)
- FPS: 15 (half source FPS)
- Duration: 5 seconds (from 0:03)
- Loop: infinite
- Optimize: balanced

Estimated size: ~3-5 MB
Processing time: ~10-15 seconds

Proceed? [Yes/No]
```

## 2-Pass Processing

### From Video

**Pass 1 - Generate palette**:
```bash
ffmpeg -ss 00:00:03 -t 5 -i video.mp4 \
  -vf "fps=15,scale=480:-1:flags=lanczos,palettegen=stats_mode=diff" \
  -y /tmp/palette.png
```

**Pass 2 - Create GIF**:
```bash
ffmpeg -ss 00:00:03 -t 5 -i video.mp4 -i /tmp/palette.png \
  -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 \
  output.gif
```

### From Image Sequence

**With FFmpeg**:
```bash
ffmpeg -framerate 15 -pattern_type glob -i "frames/*.png" \
  -vf "scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 \
  output.gif
```

**With ImageMagick** (alternative):
```bash
magick -delay 6 frames/*.png \
  -resize 480x \
  -layers optimize \
  output.gif
```

**Note**: Delay calculation: `100 / FPS` (e.g., 15 FPS = 6.67ms ≈ 6)

## Additional Optimization

For even smaller files, use gifsicle (optional):

```bash
gifsicle -O3 --lossy=80 output.gif -o output_optimized.gif
```

**Lossy compression levels**:
- `--lossy=30` - Minimal quality loss
- `--lossy=80` - Good balance
- `--lossy=200` - Maximum compression

## Processing Results

```
✓ GIF created successfully

Output: video.gif
- Size: 4.2 MB
- Dimensions: 480 x 270
- Frames: 75 (5s @ 15fps)
- Duration: 5 seconds
- Loop: infinite

Performance:
- Pass 1 (palette): 2.1s
- Pass 2 (encoding): 8.4s
- Total time: 10.5s

Tip: Use --Optimize size for smaller files or --Width 320 to reduce size further
```

## Best Practices

1. **Reduce file size**:
   - Lower FPS (12-15 works well for most content)
   - Smaller width (480px or less)
   - Use "size" optimization preset
   - Trim to shortest necessary duration

2. **Better quality**:
   - Higher FPS (24-30 for smooth motion)
   - Larger width (640-800px)
   - Use "quality" optimization preset

3. **Smooth motion**:
   - Use 24+ FPS for fast action
   - Use 12-15 FPS for simple content or talking heads

4. **Social media**:
   - Most platforms compress GIFs automatically
   - Upload slightly higher quality than needed
   - Test file size limits (Twitter: 5MB, Discord: 8MB)

5. **Performance**:
   - Shorter clips process faster
   - Lower resolution = faster encoding
   - 2-pass method is slower but produces better results

## Platform Limits

| Platform | Max Size | Recommended Settings |
|----------|----------|----------------------|
| Twitter/X | 5 MB | 480px, 15fps, 5-10s |
| Discord | 8 MB | 640px, 15fps, 5-10s |
| Slack | 5 MB | 480px, 12fps, 5-10s |
| GitHub | 10 MB | 640px, 15fps, 10-15s |
| Email | 1-2 MB | 320px, 12fps, 3-5s |

## Requirements

- **FFmpeg** - Required for video processing
- **ImageMagick 7+** - Optional for image sequences
- **gifsicle** - Optional for additional optimization

Install all:
```bash
brew install ffmpeg imagemagick gifsicle
```

Verify FFmpeg:
```bash
ffmpeg -version | head -n 1
```

## Related Files

- **Command**: `plugins/media-tools/commands/gif.md`
- **Video Processing**: `plugins/media-tools/skills/video-processing/`
- **Media Processor**: `plugins/media-tools/skills/media-processor/`
