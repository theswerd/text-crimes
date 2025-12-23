import React from 'react';

// Unicode Combining Marks Library
// Arabic Qur'anic marks - all are General Category: Mn (Nonspacing Mark)
// Zero width, attach to preceding grapheme

// Mark height ratios (measured empirically)
// Reference: 38 meemIsolated = 50 seen (above), 44 lowMeem = 50 seen (below)
export const MARK_HEIGHTS = {
  above: {
    seen: 1.0,            // reference unit
    meemIsolated: 50 / 38, // ≈ 1.316
  },
  below: {
    seen: 1.0,            // reference unit
    lowMeem: 50 / 44,     // ≈ 1.136
  },
};

export const MARKS = {
  above: {
    // U+06D6–U+06DC: Small High Ligatures & Letters
    sadLamAlef: '\u06D6',     // ۖ ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
    qafLamAlef: '\u06D7',     // ۗ ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
    meemInitial: '\u06D8',    // ۘ ARABIC SMALL HIGH MEEM INITIAL FORM
    lamAlef: '\u06D9',        // ۙ ARABIC SMALL HIGH LAM ALEF
    jeem: '\u06DA',           // ۚ ARABIC SMALL HIGH JEEM
    threeDots: '\u06DB',      // ۛ ARABIC SMALL HIGH THREE DOTS
    seen: '\u06DC',           // ۜ ARABIC SMALL HIGH SEEN

    // U+06DF–U+06E2: More Small High Marks
    roundedZero: '\u06DF',    // ۟ ARABIC SMALL HIGH ROUNDED ZERO
    rectangularZero: '\u06E0',// ۠ ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
    dotlessHead: '\u06E1',    // ۡ ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
    meemIsolated: '\u06E2',   // ۢ ARABIC SMALL HIGH MEEM ISOLATED FORM

    // U+06E7–U+06E8: Small Letters
    yeh: '\u06E7',            // ۧ ARABIC SMALL HIGH YEH
    noon: '\u06E8',           // ۨ ARABIC SMALL HIGH NOON

    // U+06EA–U+06EC: More annotation marks
    emptyCenterHigh: '\u06EB',// ۫ ARABIC EMPTY CENTRE HIGH STOP
    roundedHighStop: '\u06EC',// ۬ ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE

    // U+06E4: Madda (above)
    madda: '\u06E4',          // ۤ ARABIC SMALL HIGH MADDA
  },

  below: {
    // U+06E3: Small Low Seen
    seen: '\u06E3',           // ۣ ARABIC SMALL LOW SEEN

    // U+06ED: Low Meem
    lowMeem: '\u06ED',        // ۭ ARABIC SMALL LOW MEEM

    // U+06EA: Empty Centre Low Stop
    emptyCenter: '\u06EA',    // ۪ ARABIC EMPTY CENTRE LOW STOP
  },
} as const;

// All marks as a flat array for iteration
export const ALL_ABOVE = Object.entries(MARKS.above).map(([name, char]) => ({ name, char }));
export const ALL_BELOW = Object.entries(MARKS.below).map(([name, char]) => ({ name, char }));
export const ALL_MARKS = [...ALL_ABOVE.map(m => ({ ...m, position: 'above' as const })), ...ALL_BELOW.map(m => ({ ...m, position: 'below' as const }))];

export type AboveMark = keyof typeof MARKS.above;
export type BelowMark = keyof typeof MARKS.below;

// Apply a single mark to each character
export function applyMark(text: string, mark: string): string {
  return [...text].map(char => char + mark).join('');
}

// Apply multiple marks to each character (marks applied in order)
export function applyMarks(text: string, marks: string[]): string {
  const combined = marks.join('');
  return [...text].map(char => char + combined).join('');
}

// Repeat a mark multiple times for heavy stacking
export function repeatMark(text: string, mark: string, count: number): string {
  const repeated = mark.repeat(count);
  return [...text].map(char => char + repeated).join('');
}

// Stack config for composing above + below
export interface StackConfig {
  above?: { mark: AboveMark; count: number }[];
  below?: { mark: BelowMark; count: number }[];
}

export function stack(text: string, config: StackConfig): string {
  const marks: string[] = [];

  if (config.above) {
    for (const { mark, count } of config.above) {
      marks.push(MARKS.above[mark].repeat(count));
    }
  }
  if (config.below) {
    for (const { mark, count } of config.below) {
      marks.push(MARKS.below[mark].repeat(count));
    }
  }

  return applyMarks(text, marks);
}

// Strip all combining marks (Mn category) from text
export function strip(text: string): string {
  return text.replace(/\p{Mn}/gu, '');
}

// Count visible characters (grapheme clusters)
export function countGraphemes(text: string): number {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(text)].length;
}

// Safe truncate without splitting grapheme clusters
export function truncate(text: string, maxGraphemes: number): string {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const segments = [...segmenter.segment(text)];
  return segments.slice(0, maxGraphemes).map(s => s.segment).join('');
}

// Binary image data structure for imageToMarks
export interface BinaryImageData {
  width: number;           // Number of columns (characters)
  height: number;          // Total vertical height (above + below)
  aboveHeight: number;     // How many rows go above the baseline
  belowHeight: number;     // How many rows go below the baseline
  pixels: number[][];      // 2D array: pixels[column][row] = 0 or 1
                           // row 0 = bottom of below, row (height-1) = top of above
}

// Options for imageToMarks
export interface ImageToMarksOptions {
  markClassName?: string;  // When provided, returns JSX with marks wrapped in styled span
  skipChars?: string;      // Characters to skip (no marks added), e.g. "' -"
}

// Convert binary image data to stacked marks
// 0 = meemIsolated (above) / lowMeem (below) - taller marks
// 1 = seen (above) / seen (below) - shorter marks
// Uses equal visual space algorithm: each source pixel occupies the same
// visual height regardless of its value. Rounding errors propagate forward
// and get corrected by subsequent pixels.
// baseText: uses each character in sequence, falls back to ' ' when exhausted
export function imageToMarks(
  data: BinaryImageData,
  baseText: string = 'g',
  options?: ImageToMarksOptions
): string | React.ReactNode {
  const { width, aboveHeight, belowHeight, pixels } = data;
  const fallbackChar = ' ';

  // Build column data - include all baseText characters even if beyond image width
  const totalColumns = Math.max(width, baseText.length);
  const columns: { baseChar: string; marks: string }[] = [];

  for (let col = 0; col < totalColumns; col++) {
    const column = pixels[col] || [];
    const baseChar = col < baseText.length ? baseText[col] : fallbackChar;
    const hasImageData = col < width;

    // Build marks only if we have image data for this column
    // Skip marks for characters in skipChars
    let aboveMarks = '';
    let belowMarks = '';
    const shouldSkip = options?.skipChars?.includes(baseChar);

    if (hasImageData && !shouldSkip) {
      // Build above marks (rows belowHeight to height-1, from baseline up)
      // Each pixel should occupy 1.0 seen-units of visual height
      let currentHeight = 0;

      for (let row = belowHeight; row < belowHeight + aboveHeight; row++) {
        const pixelIndex = row - belowHeight;
        const targetHeight = pixelIndex + 1; // target cumulative height in seen-units
        const bit = column[row] ?? 0;
        const mark = bit === 1 ? MARKS.above.seen : MARKS.above.meemIsolated;
        const markHeight = bit === 1 ? MARK_HEIGHTS.above.seen : MARK_HEIGHTS.above.meemIsolated;

        // Calculate how many marks to emit for this pixel (rounded)
        const numMarks = Math.round((targetHeight - currentHeight) / markHeight);
        for (let i = 0; i < numMarks; i++) {
          aboveMarks += mark;
        }
        currentHeight += numMarks * markHeight;
      }

      // Build below marks (rows 0 to belowHeight-1, from baseline down)
      currentHeight = 0;

      for (let row = belowHeight - 1; row >= 0; row--) {
        const pixelIndex = belowHeight - 1 - row;
        const targetHeight = pixelIndex + 1; // target cumulative height in seen-units
        const bit = column[row] ?? 0;
        const mark = bit === 1 ? MARKS.below.seen : MARKS.below.lowMeem;
        const markHeight = bit === 1 ? MARK_HEIGHTS.below.seen : MARK_HEIGHTS.below.lowMeem;

        // Calculate how many marks to emit for this pixel (rounded)
        const numMarks = Math.round((targetHeight - currentHeight) / markHeight);
        for (let i = 0; i < numMarks; i++) {
          belowMarks += mark;
        }
        currentHeight += numMarks * markHeight;
      }
    }

    columns.push({ baseChar, marks: aboveMarks + belowMarks });
  }

  // Return JSX if markClassName is provided
  if (options?.markClassName) {
    return (
      <>
        {columns.map((col, i) => (
          <React.Fragment key={i}>
            {col.baseChar}
            <span className={options.markClassName}>{col.marks}</span>
          </React.Fragment>
        ))}
      </>
    );
  }

  // Return plain string for backward compatibility
  return columns.map(col => col.baseChar + col.marks).join('');
}
