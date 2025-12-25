---
description: Smart image processing - resize, compress, convert (auto-detects single file or batch)
allowed-tools: [Bash, Read, Glob, AskUserQuestion]
argument-hint: <file_or_folder> [options]
arguments:
  - name: Resolution
    default: "original"
    options: ["original", "3840", "2560", "1920", "1280", "800", "640", "custom"]
  - name: Ratio
    default: "original"
    options: ["original", "16:9", "9:16", "3:2", "1:1", "4:5", "4:3", "21:9"]
  - name: Format
    default: "webp"
    options: ["original", "webp", "jpg", "png", "avif"]
  - name: Quality
    default: "85"
    options: ["95", "85", "75", "65", "55", "45"]
  - name: Output
    default: "same"
    options: ["same", "subfolder", "custom"]
---

# Image Command

Smart image processing that automatically handles single files or batch operations.

## Arguments

$ARGUMENTS

## Intelligent Behavior

This command automatically detects input type:

| Input | Behavior |
|-------|----------|
| Single file (`photo.jpg`) | Process that file |
| Directory (`./photos/`) | Process all images in directory |
| Glob pattern (`*.png`) | Process matching files |
| Multiple files | Process each file |

## Task

### Step 1: Detect Input Type

Parse `$ARGUMENTS` to determine:

```
INPUT_TYPE = detect_type(input)
  - "file" if input is a single image file
  - "directory" if input is a folder path
  - "glob" if input contains wildcards (*, ?)
  - "multiple" if comma-separated or multiple paths
```

### Step 2: Gather Files

**Single file:**
```bash
files=("$input")
```

**Directory:**
```bash
files=($(find "$input" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.tiff" -o -iname "*.avif" \)))
```

**Glob pattern:**
```bash
files=($input)
```

### Step 3: Show Preview (for batch)

If more than 1 file, show preview and ask confirmation:

```
Found 24 images to process:
- photo1.jpg (2.4 MB)
- photo2.png (1.8 MB)
- ... and 22 more

Settings:
- Resolution: 1920 (original → 1920px width)
- Ratio: 16:9 (will crop to fit)
- Format: webp
- Quality: 85%
- Output: ./processed/

Proceed? [Yes/No]
```

### Step 4: Calculate Dimensions

**If Resolution is "original":** Keep original dimensions
**If Resolution is "custom":** Ask user for width
**If Ratio is "original":** Keep original aspect ratio

Calculate height from ratio:
```
16:9  → height = width × 9/16
9:16  → height = width × 16/9
3:2   → height = width × 2/3
1:1   → height = width
4:5   → height = width × 5/4
4:3   → height = width × 3/4
21:9  → height = width × 9/21
```

### Step 5: Determine Output Path

| Output Setting | Behavior |
|----------------|----------|
| `same` | Same directory, new extension |
| `subfolder` | Create `./processed/` subdirectory |
| `custom` | Ask user for path |

### Step 6: Process Images

For each file, build and execute command:

**With resize and crop:**
```bash
magick "$input" \
  -resize ${width}x${height}^ \
  -gravity center \
  -extent ${width}x${height} \
  -quality $quality \
  -strip \
  "$output"
```

**Compress only (original resolution and ratio):**
```bash
magick "$input" \
  -quality $quality \
  -strip \
  "$output"
```

**Resize without crop (original ratio):**
```bash
magick "$input" \
  -resize ${width}x \
  -quality $quality \
  -strip \
  "$output"
```

### Step 7: Report Results

```
✓ Processed 24 images

Summary:
- Total input:  45.2 MB
- Total output: 12.8 MB
- Compression:  72% smaller

Output: ./processed/
```

## Usage Examples

### Single file - resize and convert
```bash
/image photo.jpg --Resolution 1920 --Ratio 16:9 --Format webp
```

### Single file - compress only
```bash
/image photo.jpg --Format webp --Quality 75
```

### Batch - entire folder
```bash
/image ./photos/ --Resolution 1280 --Format webp --Output subfolder
```

### Batch - specific files
```bash
/image "*.png" --Format webp --Quality 85
```

### Batch - Instagram ready (4:5)
```bash
/image ./uploads/ --Resolution 1280 --Ratio 4:5 --Format jpg
```

### Batch - Stories format (9:16)
```bash
/image ./content/ --Resolution 1080 --Ratio 9:16 --Format jpg --Quality 90
```

## Preset Combinations

| Use Case | Resolution | Ratio | Format | Quality |
|----------|------------|-------|--------|---------|
| Web hero | 1920 | 16:9 | webp | 85 |
| Thumbnail | 640 | 16:9 | webp | 75 |
| Instagram post | 1280 | 1:1 | jpg | 85 |
| Instagram story | 1080 | 9:16 | jpg | 85 |
| Twitter/X | 1280 | 16:9 | jpg | 85 |
| LinkedIn | 1920 | 1.91:1 | jpg | 85 |
| OG image | 1200 | 1.91:1 | jpg | 85 |
| 4K wallpaper | 3840 | 16:9 | png | 95 |

## Requirements

- ImageMagick 7+ (`magick` command)
- Install: `brew install imagemagick`

## Output

- Preserves original files
- Reports per-file and total compression
- Shows processing time for batch operations
