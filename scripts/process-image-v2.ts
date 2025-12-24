import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';

interface GrayscaleImageData {
  width: number;
  height: number;
  pixels: number[][];  // 0-1 values (0=white, 1=black)
}

interface ProcessOptions {
  width: number;
  height: number;
  outputDir?: string;
}

async function processImage(inputPath: string, options: ProcessOptions): Promise<void> {
  const { width, height, outputDir } = options;

  // Load and process image
  const image = sharp(inputPath);

  // Resize to target dimensions and convert to grayscale
  const resized = await image
    .resize(width, height, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();

  // Build pixels array (column-major order)
  // pixels[col][row] where row 0 = bottom (baseline), row height-1 = top
  const pixels: number[][] = [];

  for (let col = 0; col < width; col++) {
    const column: number[] = [];
    for (let row = 0; row < height; row++) {
      // Image row 0 is top, but we want row 0 to be bottom
      const imageRow = height - 1 - row;
      const pixelIndex = imageRow * width + col;
      const grayValue = resized[pixelIndex];
      // Convert 0-255 to 0-1 where 0=white, 1=black
      column.push(1 - grayValue / 255);
    }
    pixels.push(column);
  }

  // Create GrayscaleImageData
  const data: GrayscaleImageData = {
    width,
    height,
    pixels,
  };

  // Generate preview PNG
  const previewBuffer = Buffer.alloc(width * height);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const imageRow = height - 1 - row;
      const pixelIndex = imageRow * width + col;
      previewBuffer[pixelIndex] = Math.round((1 - pixels[col][row]) * 255);
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
  console.log(`Dimensions: ${width}x${height}`);
}

// CLI argument parsing
function parseArgs(): { inputPath: string; options: ProcessOptions } {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx ts-node scripts/process-image-v2.ts <input> [options]

Arguments:
  input              Input image path

Options:
  --width <n>        Number of columns (characters)
  --height <n>       Number of rows (marks stacked)
  --output <dir>     Output directory (default: same as input)
  -h, --help         Show this help
    `);
    process.exit(0);
  }

  const inputPath = args[0];
  const options: ProcessOptions = {
    width: 50,
    height: 80,
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
