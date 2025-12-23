'use client';

import { ALL_ABOVE } from '../lib/unicode';

export function SideText({ side }: { side: 'left' | 'right' }) {
  const allAboveMarks = ALL_ABOVE.map(m => m.char).join('');
  const marks = allAboveMarks.repeat(100);

  return (
    <div
      className="absolute bottom-0 text-2xl z-50 -rotate-[1.05deg] text-gray-400"
      style={{
        [side]: side === 'left' ? '20px': '30px',
      }}
    >
      {marks}
    </div>
  );
}
