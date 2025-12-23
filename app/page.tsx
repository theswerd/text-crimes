import { ALL_ABOVE, ALL_BELOW, MARKS, repeatMark } from './lib/unicode';

// Alternating pattern: 50 threeDots + 50 emptyCenterHigh, repeated 15 times
function alternatingStack(base: string, count1: number, count2: number, repeats: number): string {
  const mark1 = MARKS.above.threeDots.repeat(count1);
  const mark2 = MARKS.above.emptyCenterHigh.repeat(count2);
  const pattern = (mark1 + mark2).repeat(repeats);
  return base + pattern;
}

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-2">Arabic Stacking Marks × 20</h1>
      <p className="text-zinc-500 mb-8">{ALL_ABOVE.length + ALL_BELOW.length} marks total ({ALL_ABOVE.length} above, {ALL_BELOW.length} below)</p>
      <div className="overflow-x-auto">
        <table className="border-separate" style={{ borderSpacing: '20px 200px' }}>
          <thead>
            <tr>
              <th className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-left text-sm">Letter</th>
              {ALL_ABOVE.map(({ name, char }) => (
                <th key={name} className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-xs">
                  <div className="whitespace-nowrap">{name}</div>
                  <div className="text-zinc-500 font-mono">
                    U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                  </div>
                </th>
              ))}
              <th className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-xs">
                <div className="whitespace-nowrap">threeDots + emptyCenterHigh</div>
                <div className="text-zinc-500 font-mono">alternating 1×10</div>
              </th>
              <th className="border-l-4 border-l-zinc-500 border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-xs">
                <div className="whitespace-nowrap text-zinc-400">BELOW</div>
              </th>
              {ALL_BELOW.map(({ name, char }) => (
                <th key={name} className="border border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-xs">
                  <div className="whitespace-nowrap">{name}</div>
                  <div className="text-zinc-500 font-mono">
                    U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {letters.map((letter) => (
              <tr key={letter}>
                <td className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-2xl font-bold text-center">
                  {letter}
                </td>
                {ALL_ABOVE.map(({ name, char }) => (
                  <td
                    key={name}
                    className="border border-zinc-700 px-4 py-2 text-center text-3xl h-48 align-middle"
                  >
                    {repeatMark(letter, char, 20)}
                  </td>
                ))}
                <td className="border border-zinc-700 px-4 py-2 text-center text-3xl h-48 align-middle">
                  {alternatingStack(letter, 1, 1, 10)}
                </td>
                <td className="border-l-4 border-l-zinc-500 border border-zinc-700 bg-zinc-800/50"></td>
                {ALL_BELOW.map(({ name, char }) => (
                  <td
                    key={name}
                    className="border border-zinc-700 px-4 py-2 text-center text-3xl h-48 align-middle"
                  >
                    {repeatMark(letter, char, 20)}
                  </td>
                ))}
              </tr>
            ))}
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
    </main>
  );
}
