import { MARKS } from '../lib/unicode';

export function Checkerboard({ columns = 20, height = 10 }: { columns?: number; height?: number }) {
  const chars = '-'.repeat(columns);

  return (
    <div
      style={{
        
        fontFamily: 'var(--font-geist), sans-serif',
        fontSize: '20px',
      }}
    >
      {[...chars].map((char, i) => (
        <span key={i} className='hover:text-red-700'>
          {char +
            (i % 2 === 0
              ? (MARKS.above.seen + MARKS.above.meemIsolated).repeat(height)
              : (MARKS.above.meemIsolated + MARKS.above.seen).repeat(height)) +
            (i % 2 === 0
              ? (MARKS.below.seen + MARKS.below.lowMeem).repeat(height)
              : (MARKS.below.lowMeem + MARKS.below.seen).repeat(height))}
        </span>
      ))}
    </div>
  );
}
