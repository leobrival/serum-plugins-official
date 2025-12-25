---
description: Create optimized GIFs from videos or image sequences
allowed-tools: [Bash, Read, Glob, AskUserQuestion]
argument-hint: <video_or_images> [options]
arguments:
  - name: Width
    default: "480"
    options: ["800", "640", "480", "320", "240"]
  - name: FPS
    default: "15"
    options: ["30", "24", "20", "15", "12", "10"]
  - name: Duration
    default: "full"
    options: ["full", "10", "5", "3", "custom"]
  - name: Start
    default: "0"
    options: ["0", "custom"]
  - name: Loop
    default: "infinite"
    options: ["infinite", "once", "custom"]
  - name: Optimize
    default: "balanced"
    options: ["quality", "balanced", "size"]
---

# GIF Command

Create optimized, high-quality GIFs from videos or image sequences.

## Arguments

$ARGUMENTS

## Intelligent Behavior

| Input | Behavior |
|-------|----------|
| Video file (`video.mp4`) | Convert video to GIF |
| Image folder (`./frames/`) | Create GIF from image sequence |
| Glob pattern (`frame_*.png`) | Create GIF from matching images |

## Task

### Step 1: Detect Input Type

Determine if input is:
- Video file → Use FFmpeg 2-pass method
- Image sequence → Use ImageMagick or FFmpeg

### Step 2: Get Source Info

**For video:**
```bash
duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$input")
resolution=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$input")
```

**For images:**
```bash
count=$(find "$input" -type f \( -iname "*.png" -o -iname "*.jpg" \) | wc -l)
```

### Step 3: Handle Timing Options

**If Start is "custom":**
```
Enter start time (HH:MM:SS or seconds):
```

**If Duration is "custom":**
```
Enter duration (seconds or HH:MM:SS):
```

### Step 4: Map Optimize Setting

| Setting | Palette Mode | Dither | Colors | Description |
|---------|--------------|--------|--------|-------------|
| quality | full | floyd_steinberg | 256 | Best visual quality |
| balanced | diff | bayer:5 | 256 | Good balance (default) |
| size | single | none | 128 | Smallest file size |

### Step 5: Show Preview

```
Creating GIF from: video.mp4

Source:
- Duration: 0:15
- Resolution: 1920x1080

Output settings:
- Width: 480px (auto height)
- FPS: 15
- Duration: 5 seconds (from 0:03)
- Optimize: balanced

Estimated size: ~3-5 MB

Proceed? [Yes/No]
```

### Step 6: Create GIF

**From video (2-pass for quality):**

```bash
# Pass 1: Generate optimized palette
ffmpeg -ss $start -t $duration -i "$input" \
  -vf "fps=$fps,scale=$width:-1:flags=lanczos,palettegen=stats_mode=$palette_mode" \
  -y /tmp/palette.png

# Pass 2: Create GIF with palette
ffmpeg -ss $start -t $duration -i "$input" -i /tmp/palette.png \
  -lavfi "fps=$fps,scale=$width:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=$dither" \
  -loop $loop \
  "$output.gif"

# Cleanup
rm /tmp/palette.png
```

**From image sequence:**

```bash
# With FFmpeg
ffmpeg -framerate $fps -pattern_type glob -i "$input/*.png" \
  -vf "scale=$width:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop $loop \
  "$output.gif"

# Or with ImageMagick
magick -delay $(echo "100/$fps" | bc) "$input/*.png" \
  -resize ${width}x \
  -layers optimize \
  "$output.gif"
```

### Step 7: Optimize Output (optional)

For further size reduction:
```bash
# Using gifsicle (if available)
gifsicle -O3 --lossy=80 "$output.gif" -o "$output_optimized.gif"
```

### Step 8: Report Results

```
✓ GIF created successfully

Output: video.gif
- Size: 4.2 MB
- Dimensions: 480 x 270
- Frames: 75
- Duration: 5 seconds
- FPS: 15

Tip: Use --Optimize size for smaller files
```

## Usage Examples

### Video to GIF - basic
```bash
/gif video.mp4
```

### Video to GIF - first 5 seconds
```bash
/gif video.mp4 --Duration 5
```

### Video to GIF - custom clip
```bash
/gif video.mp4 --Start custom --Duration custom --Width 640
# Then specify: start=00:00:30, duration=10
```

### Video to GIF - small file size
```bash
/gif video.mp4 --Width 320 --FPS 12 --Optimize size
```

### Video to GIF - high quality
```bash
/gif video.mp4 --Width 800 --FPS 24 --Optimize quality
```

### Image sequence to GIF
```bash
/gif ./frames/ --FPS 24 --Width 640
```

### Image sequence - specific pattern
```bash
/gif "frame_*.png" --FPS 15 --Loop once
```

## Size Estimation Guide

| Width | 5s @ 15fps | 10s @ 15fps | 5s @ 24fps |
|-------|------------|-------------|------------|
| 800px | 8-15 MB | 15-30 MB | 12-24 MB |
| 640px | 5-10 MB | 10-20 MB | 8-16 MB |
| 480px | 3-6 MB | 6-12 MB | 5-10 MB |
| 320px | 1-3 MB | 2-6 MB | 2-5 MB |
| 240px | 0.5-2 MB | 1-4 MB | 1-3 MB |

## Loop Options

| Setting | Behavior |
|---------|----------|
| infinite | Loop forever (default) |
| once | Play once and stop |
| custom | Ask for loop count |

## Requirements

- FFmpeg (required)
- ImageMagick 7+ (optional, for image sequences)
- gifsicle (optional, for extra optimization)
- Install: `brew install ffmpeg imagemagick gifsicle`

## Tips

1. **Reduce file size:** Lower FPS (12-15), smaller width, use "size" optimize
2. **Better quality:** Higher FPS (24-30), larger width, use "quality" optimize
3. **Smooth motion:** Use 24+ FPS for action, 12-15 for simple content
4. **Social media:** Most platforms compress GIFs, so upload slightly higher quality
