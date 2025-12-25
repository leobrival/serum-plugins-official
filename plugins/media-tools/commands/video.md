---
description: Smart video processing - compress, convert, extract clips (auto-detects single file or batch)
allowed-tools: [Bash, Read, Glob, AskUserQuestion]
argument-hint: <file_or_folder> [options]
arguments:
  - name: Resolution
    default: "original"
    options: ["original", "4K", "1440p", "1080p", "720p", "480p", "custom"]
  - name: Format
    default: "mp4"
    options: ["original", "mp4", "webm", "mov", "gif"]
  - name: Quality
    default: "medium"
    options: ["high", "medium", "low", "web"]
  - name: FPS
    default: "original"
    options: ["original", "60", "30", "24", "15"]
  - name: Trim
    default: "full"
    options: ["full", "custom"]
  - name: Audio
    default: "keep"
    options: ["keep", "remove", "extract"]
  - name: Output
    default: "same"
    options: ["same", "subfolder", "custom"]
---

# Video Command

Smart video processing that automatically handles single files or batch operations.

## Arguments

$ARGUMENTS

## Intelligent Behavior

This command automatically detects input type:

| Input | Behavior |
|-------|----------|
| Single file (`video.mp4`) | Process that file |
| Directory (`./videos/`) | Process all videos in directory |
| Glob pattern (`*.mov`) | Process matching files |
| Multiple files | Process each file |

## Task

### Step 1: Detect Input Type

Parse `$ARGUMENTS` to determine input type (file, directory, glob, or multiple).

### Step 2: Gather Files

**Supported formats:** mp4, mov, avi, mkv, webm, m4v, flv, wmv

**Directory scan:**
```bash
files=($(find "$input" -maxdepth 1 -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" -o -iname "*.mkv" -o -iname "*.webm" -o -iname "*.m4v" \)))
```

### Step 3: Analyze Videos (for batch)

Get info for each video:
```bash
ffprobe -v quiet -print_format json -show_format -show_streams "$file"
```

Show preview:
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

### Step 4: Handle Trim Option

**If Trim is "custom":**
Ask user for start time and duration:
```
Enter start time (HH:MM:SS or seconds): 00:00:30
Enter duration (HH:MM:SS or seconds, or 'end' for rest): 00:01:00
```

### Step 5: Map Settings

**Resolution to width:**
```
4K     → 3840
1440p  → 2560
1080p  → 1920
720p   → 1280
480p   → 854
```

**Quality to CRF:**
| Quality | H.264 CRF | VP9 CRF | Description |
|---------|-----------|---------|-------------|
| high | 18 | 24 | Archival, minimal loss |
| medium | 23 | 30 | Balanced (default) |
| low | 28 | 36 | Smaller files |
| web | 30 | 38 | Streaming optimized |

### Step 6: Build FFmpeg Command

**MP4 (H.264) - Standard:**
```bash
ffmpeg -i "$input" \
  -vf "scale=$width:-2" \
  -c:v libx264 \
  -crf $crf \
  -preset medium \
  -c:a aac -b:a 128k \
  "$output"
```

**MP4 with trim:**
```bash
ffmpeg -ss $start -t $duration -i "$input" \
  -vf "scale=$width:-2" \
  -c:v libx264 \
  -crf $crf \
  -preset medium \
  -c:a aac -b:a 128k \
  "$output"
```

**WebM (VP9):**
```bash
ffmpeg -i "$input" \
  -vf "scale=$width:-2" \
  -c:v libvpx-vp9 \
  -crf $crf -b:v 0 \
  -c:a libopus -b:a 128k \
  "$output"
```

**GIF (optimized 2-pass):**
```bash
# Pass 1: Generate palette
ffmpeg -i "$input" \
  -vf "fps=$fps,scale=$width:-1:flags=lanczos,palettegen=stats_mode=diff" \
  -y /tmp/palette.png

# Pass 2: Create GIF
ffmpeg -i "$input" -i /tmp/palette.png \
  -lavfi "fps=$fps,scale=$width:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  "$output"
```

**Remove audio:**
```bash
ffmpeg -i "$input" -an ...
```

**Extract audio only:**
```bash
ffmpeg -i "$input" -vn -c:a aac -b:a 192k "${output%.mp4}.m4a"
```

### Step 7: Process and Report

Show progress for each file:
```
[1/8] intro.mov → intro.mp4
      4K → 1080p | 2.1 GB → 245 MB (88% smaller)

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

## Usage Examples

### Single file - compress
```bash
/video video.mov --Resolution 1080p --Format mp4 --Quality medium
```

### Single file - convert to web format
```bash
/video video.mov --Format webm --Quality web
```

### Single file - extract clip
```bash
/video video.mp4 --Trim custom --Resolution 720p
# Then specify: start=00:01:30, duration=00:00:30
```

### Single file - create GIF
```bash
/video video.mp4 --Format gif --Resolution 480p --FPS 15
```

### Batch - compress folder
```bash
/video ./raw/ --Resolution 1080p --Format mp4 --Output subfolder
```

### Batch - convert all MOV to MP4
```bash
/video "*.mov" --Format mp4 --Quality medium
```

### Remove audio from videos
```bash
/video ./videos/ --Audio remove --Format mp4
```

### Extract audio tracks
```bash
/video ./videos/ --Audio extract
```

## Preset Combinations

| Use Case | Resolution | Format | Quality | FPS |
|----------|------------|--------|---------|-----|
| YouTube upload | 1080p | mp4 | high | original |
| Twitter/X | 720p | mp4 | medium | 30 |
| Instagram Reel | 1080p | mp4 | medium | 30 |
| TikTok | 1080p | mp4 | medium | 30 |
| Web background | 720p | webm | low | 24 |
| Email attachment | 480p | mp4 | low | 24 |
| GIF preview | 480p | gif | - | 15 |
| Archival | original | mp4 | high | original |

## Requirements

- FFmpeg with libx264, libvpx-vp9, libopus
- Install: `brew install ffmpeg`

## Output

- Preserves original files
- Shows real-time encoding progress
- Reports per-file and total compression
- Displays processing time
