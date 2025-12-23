// Unicode Combining Marks Library
// Arabic Qur'anic marks - all are General Category: Mn (Nonspacing Mark)
// Zero width, attach to preceding grapheme

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
