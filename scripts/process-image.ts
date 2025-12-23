import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';

interface BinaryImageData {
  width: number;
  height: number;
  aboveHeight: number;
  belowHeight: number;
  pixels: number[][];
}

interface ProcessOptions {
  width: number;
  height: number;
  aboveHeight: number;
  belowHeight: number;
  threshold?: number;
  outputDir?: string;
}

async function processImage(inputPath: string, options: ProcessOptions): Promise<void> {
  const { width, height, aboveHeight, belowHeight, threshold = 128, outputDir } = options;

  // Load and process image
  const image = sharp(inputPath);

  // Resize to target dimensions and convert to grayscale
  const resized = await image
    .resize(width, height, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();

  // Build pixels array (column-major order)
  // pixels[col][row] where row 0 = bottom, row height-1 = top
  const pixels: number[][] = [];

  for (let col = 0; col < width; col++) {
    const column: number[] = [];
    for (let row = 0; row < height; row++) {
      // Image row 0 is top, but we want row 0 to be bottom
      const imageRow = height - 1 - row;
      const pixelIndex = imageRow * width + col;
      const grayValue = resized[pixelIndex];
      // Dark pixels (< threshold) = 1, light pixels = 0
      column.push(grayValue < threshold ? 1 : 0);
    }
    pixels.push(column);
  }

  // Create BinaryImageData
  const data: BinaryImageData = {
    width,
    height,
    aboveHeight,
    belowHeight,
    pixels,
  };

  // Generate preview PNG (black = 1, white = 0)
  const previewBuffer = Buffer.alloc(width * height);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const imageRow = height - 1 - row;
      const pixelIndex = imageRow * width + col;
      previewBuffer[pixelIndex] = pixels[col][row] === 1 ? 0 : 255;
    }
  }

  const previewImage = sharp(previewBuffer, {
    raw: { width, height, channels: 1 }
  });

  // Output paths
  const inputName = basename(inputPath, /\.[^.]+$/.exec(inputPath)?.[0] || '');
  const outDir = outputDir || dirname(inputPath);
  const previewPath = join(outDir, `${inputName}-preview.png`);
  const jsonPath = join(outDir, `${inputName}-data.json`);

  // Write outputs
  await previewImage.png().toFile(previewPath);
  writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  console.log(`Preview: ${previewPath}`);
  console.log(`Data: ${jsonPath}`);
  console.log(`Dimensions: ${width}x${height} (${aboveHeight} above, ${belowHeight} below)`);
}

// CLI argument parsing
function parseArgs(): { inputPath: string; options: ProcessOptions } {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx ts-node scripts/process-image.ts <input> [options]

Arguments:
  input              Input image path

Options:
  --width <n>        Number of columns (characters)
  --height <n>       Total height (above + below)
  --above <n>        Rows above baseline
  --below <n>        Rows below baseline
  --threshold <n>    Brightness threshold 0-255 (default: 128)
  --output <dir>     Output directory (default: same as input)
  -h, --help         Show this help
    `);
    process.exit(0);
  }

  const inputPath = args[0];
  const options: ProcessOptions = {
    width: 20,
    height: 40,
    aboveHeight: 20,
    belowHeight: 20,
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--width':
        options.width = parseInt(next, 10);
        i++;
        break;
      case '--height':
        options.height = parseInt(next, 10);
        i++;
        break;
      case '--above':
        options.aboveHeight = parseInt(next, 10);
        i++;
        break;
      case '--below':
        options.belowHeight = parseInt(next, 10);
        i++;
        break;
      case '--threshold':
        options.threshold = parseInt(next, 10);
        i++;
        break;
      case '--output':
        options.outputDir = next;
        i++;
        break;
    }
  }

  return { inputPath, options };
}

// Main
const { inputPath, options } = parseArgs();
processImage(inputPath, options).catch(console.error);
