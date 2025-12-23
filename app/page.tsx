import type { Metadata } from 'next';
import { ALL_ABOVE, ALL_BELOW, MARKS, repeatMark, imageToMarks, BinaryImageData } from './lib/unicode';
import imageData from './image-data.json';
import { CopyButton } from './components/CopyButton';

const pageTitle = imageToMarks(imageData as BinaryImageData, 'oh god ben how did you do this');

export const metadata: Metadata = {
  title: pageTitle,
};

// Test data: simple alternating pattern
const testImageData: BinaryImageData = {
  width: 12,
  height: 40,
  aboveHeight: 20,
  belowHeight: 20,
  pixels: Array.from({ length: 12 }, (_, col) =>
    Array.from({ length: 40 }, (_, row) => (col + row) % 2)
  ),
};

// Alternating pattern: 50 threeDots + 50 emptyCenterHigh, repeated 15 times
function alternatingStack(base: string, count1: number, count2: number, repeats: number): string {
  const mark1 = MARKS.above.threeDots.repeat(count1);
  const mark2 = MARKS.above.emptyCenterHigh.repeat(count2);
  const pattern = (mark1 + mark2).repeat(repeats);
  return base + pattern;
}

// Reorder above marks by height (shortest first)
const priorityOrder = ['roundedHighStop', 'madda', 'meemInitial', 'dotlessHead', 'yeh', 'seen', 'roundedZero', 'emptyCenterHigh', 'rectangularZero', 'threeDots', 'noon', 'sadLamAlef', 'meemIsolated', 'lamAlef', 'jeem'];
const orderedAbove = [
  ...ALL_ABOVE.filter(m => priorityOrder.includes(m.name)).sort((a, b) => priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)),
  ...ALL_ABOVE.filter(m => !priorityOrder.includes(m.name)),
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black px-8 pb-8 pt-4">
      <h1 className="text-2xl font-bold mb-2">Arabic Stacking Marks × 8</h1>
      <p className="text-zinc-500 mb-8">{ALL_ABOVE.length + ALL_BELOW.length} marks total ({ALL_ABOVE.length} above, {ALL_BELOW.length} below)</p>
      <div className="overflow-x-auto">
        <table className="border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-left text-sm">Letter</th>
              {orderedAbove.map(({ name, char }) => (
                <th key={name} className="border border-zinc-300 bg-zinc-100 px-3 py-2 text-center text-xs">
                  <div className="whitespace-nowrap">{name}</div>
                  <div className="text-zinc-500 font-mono">
                    U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                  </div>
                </th>
              ))}
              <th className="border-l-4 border-l-zinc-400 border border-zinc-300 bg-zinc-200 px-3 py-2 text-center text-xs">
                <div className="whitespace-nowrap text-zinc-600">BELOW</div>
              </th>
              {ALL_BELOW.map(({ name, char }) => (
                <th key={name} className="border border-zinc-300 bg-zinc-200 px-3 py-2 text-center text-xs">
                  <div className="whitespace-nowrap">{name}</div>
                  <div className="text-zinc-500 font-mono">
                    U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                  </div>
                </th>
              ))}
              <th className="border-l-4 border-l-zinc-400 border border-zinc-300 bg-zinc-300 px-3 py-2 text-center text-xs">
                <div className="whitespace-nowrap text-zinc-600">SPECIAL</div>
              </th>
              <th className="border border-zinc-300 bg-zinc-300 px-3 py-2 text-center text-xs">
                <div className="whitespace-nowrap">threeDots + emptyCenterHigh</div>
                <div className="text-zinc-500 font-mono">alternating 1×10</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-2xl font-bold text-center">
                x
              </td>
              {orderedAbove.map(({ name, char }) => (
                <td
                  key={name}
                  className="border border-zinc-300 px-4 py-2 text-center text-xl h-32 align-middle"
                >
                  {repeatMark('x', char, 8)}
                </td>
              ))}
              <td className="border-l-4 border-l-zinc-400 border border-zinc-300 bg-zinc-200/50"></td>
              {ALL_BELOW.map(({ name, char }) => (
                <td
                  key={name}
                  className="border border-zinc-300 px-4 py-2 text-center text-xl h-32 align-middle"
                >
                  {repeatMark('x', char, 8)}
                </td>
              ))}
              <td className="border-l-4 border-l-zinc-400 border border-zinc-300 bg-zinc-300/50"></td>
              <td className="border border-zinc-300 px-4 py-2 text-center text-xl h-32 align-middle">
                {alternatingStack('x', 1, 1, 4)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-32 text-6xl" style={{ marginBottom: '800px' }}>
        {[...'potato'].map((char, i) => (
          <span key={i}>
            {char + (i % 2 === 0 ? MARKS.below.seen.repeat(20) : MARKS.below.lowMeem.repeat(20))}
          </span>
        ))}
      </div>

      <div className="mt-32" style={{ marginBottom: '800px', fontFamily: 'Google Sans, Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: 400 }}>
        {[...'eeeeee'].map((char, i) => (
          <span key={i}>
            {char + (i % 2 === 0
              ? (MARKS.below.seen + MARKS.below.lowMeem).repeat(10)
              : (MARKS.below.lowMeem + MARKS.below.seen).repeat(10)
            )}
          </span>
        ))}
      </div>

      <div className="mt-32" style={{ marginBottom: '800px', fontFamily: 'Google Sans, Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: 400 }}>
        {[...'gggggggggggggggggggg'].map((char, i) => (
          <span key={i}>
            {char
              + (i % 2 === 0
                ? (MARKS.above.seen + MARKS.above.meemIsolated).repeat(20)
                : (MARKS.above.meemIsolated + MARKS.above.seen).repeat(20))
              + (i % 2 === 0
                ? (MARKS.below.seen + MARKS.below.lowMeem).repeat(20)
                : (MARKS.below.lowMeem + MARKS.below.seen).repeat(20))
            }
          </span>
        ))}
      </div>

      <div className="mt-32" style={{ marginBottom: '800px' }}>
        <h2 className="text-2xl font-bold mb-2">imageToMarks() Test</h2>
        <p className="text-zinc-500 mb-8">12 columns, 40 height (20 above + 20 below), alternating checkerboard pattern</p>
        <div style={{ fontFamily: 'Google Sans, Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: 400 }}>
          {imageToMarks(testImageData, 'g')}
        </div>
      </div>

      <div className="mt-32" style={{ marginBottom: '800px' }}>
        <h2 className="text-2xl font-bold mb-2">Image Data</h2>
        <p className="text-zinc-500 mb-8">{imageData.width} columns, {imageData.height} height ({imageData.aboveHeight} above + {imageData.belowHeight} below)</p>
        <div style={{ fontFamily: 'Google Sans, Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: 400 }}>
          {pageTitle}
        </div>
        <p className="text-zinc-500 mt-4">Character count (.length): {pageTitle.length}</p>
        <CopyButton text={pageTitle} />
      </div>

      <div className="mt-32" style={{ marginBottom: '800px' }}>
        <h2 className="text-2xl font-bold mb-2">Equal H</h2>
        <div style={{ fontFamily: 'Google Sans, Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: 400 }}>
          {'g' + MARKS.above.meemIsolated.repeat(38) + MARKS.below.lowMeem.repeat(44) + 'g' + MARKS.above.seen.repeat(50) + MARKS.below.seen.repeat(50)}
        </div>
      </div>
    </main>
  );
}
