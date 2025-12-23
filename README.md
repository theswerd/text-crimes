# unicoool

Create images using Unicode combining marks. Uses Arabic Qur'anic annotation marks that visually stack above and below base characters.

## How It Works

Arabic combining marks (General Category: Mn - Nonspacing Mark) attach to the preceding character and stack vertically. By choosing different marks, we can create binary patterns that render as images.

### Marks Used

**Above baseline:**
- `ۜ` (U+06DC) - Small High Seen - used for `1` bits
- `ۢ` (U+06E2) - Small High Meem Isolated Form - used for `0` bits

**Below baseline:**
- `ۣ` (U+06E3) - Small Low Seen - used for `1` bits
- `ۭ` (U+06ED) - Small Low Meem - used for `0` bits

### Height Ratios

The marks have different visual heights (measured empirically):

| Position | Mark | Height (seen-units) |
|----------|------|---------------------|
| Above | seen (1) | 1.0 |
| Above | meemIsolated (0) | 50/38 ≈ 1.316 |
| Below | seen (1) | 1.0 |
| Below | lowMeem (0) | 50/44 ≈ 1.136 |

The `imageToMarks()` function compensates for these differences using an equal visual space algorithm - each source pixel occupies the same visual height regardless of its 0/1 value.

## Usage

### Image Processing CLI

Convert an image to binary data:

```bash
npx ts-node scripts/process-image.ts input.png --width 20 --height 40 --above 20 --below 20
```

**Options:**
- `--width` - Number of columns (characters)
- `--height` - Total height (above + below rows)
- `--above` - Rows above baseline
- `--below` - Rows below baseline
- `--threshold` - Brightness threshold 0-255 (default: 128)
- `--output` - Output directory

**Outputs:**
- `{input}-preview.png` - Black/white preview
- `{input}-data.json` - BinaryImageData JSON

### Using in Code

```typescript
import { imageToMarks, BinaryImageData } from './lib/unicode';

const data: BinaryImageData = {
  width: 10,
  height: 20,
  aboveHeight: 10,
  belowHeight: 10,
  pixels: [...] // pixels[col][row] = 0 or 1, row 0 = bottom
};

const text = imageToMarks(data, 'g'); // 'g' is the base character
```

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to see the visualization.
