'use client';

import { useState } from 'react';
import { ALL_ABOVE, ALL_BELOW, MARKS, repeatMark } from '../lib/unicode';

// Reorder above marks by height (shortest first)
const priorityOrder = ['roundedHighStop', 'madda', 'meemInitial', 'dotlessHead', 'yeh', 'seen', 'roundedZero', 'emptyCenterHigh', 'rectangularZero', 'threeDots', 'noon', 'sadLamAlef', 'meemIsolated', 'lamAlef', 'jeem'];
const orderedAbove = [
  ...ALL_ABOVE.filter(m => priorityOrder.includes(m.name)).sort((a, b) => priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name)),
  ...ALL_ABOVE.filter(m => !priorityOrder.includes(m.name)),
];

const baseChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function alternatingStack(base: string, count1: number, count2: number, repeats: number): string {
  const mark1 = MARKS.above.threeDots.repeat(count1);
  const mark2 = MARKS.above.emptyCenterHigh.repeat(count2);
  const pattern = (mark1 + mark2).repeat(repeats);
  return base + pattern;
}

const allMarks = [...orderedAbove.map(m => ({ ...m, pos: 'above' })), ...ALL_BELOW.map(m => ({ ...m, pos: 'below' }))];

export function CharacterCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <div className='relative h-[172px]'>
    <div
      className="overflow-hidden  bg-gray-50 z-50 absolute"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex carousel-track "
        style={{
          animationPlayState: paused ? 'paused' : 'running'
        }}
      >
        {/* First copy */}
        {allMarks.map(({ name, char, pos }, i) => (
          <div key={`${pos}-${name}`} className="shrink-0 px-12 py-2 text-center border-y border-r border-zinc-300">
            <div className="text-xl h-32 flex items-center justify-center">
              {repeatMark(baseChars[i % baseChars.length], char, 8)}
            </div>
            <div className="text-xs whitespace-nowrap">{name}</div>
            <div className="text-zinc-500 font-mono text-xs">
              U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
            </div>
          </div>
        ))}
        <div className="shrink-0 px-12 py-2 text-center border-y border-r border-zinc-300">
          <div className="text-xl h-32 flex items-center justify-center">
            {alternatingStack('z', 1, 1, 4)}
          </div>
          <div className="text-xs whitespace-nowrap">threeDots + emptyCenterHigh</div>
          <div className="text-zinc-500 font-mono text-xs">alternating</div>
        </div>
        {/* Second copy for seamless loop */}
        {allMarks.map(({ name, char, pos }, i) => (
          <div key={`${pos}-${name}-2`} className="shrink-0 px-12 py-2 text-center border-y border-r border-zinc-300">
            <div className="text-xl h-32 flex items-center justify-center">
              {repeatMark(baseChars[i % baseChars.length], char, 8)}
            </div>
            <div className="text-xs whitespace-nowrap">{name}</div>
            <div className="text-zinc-500 font-mono text-xs">
              U+{char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
            </div>
          </div>
        ))}
        <div className="shrink-0 px-12 py-2 text-center border-y border-r border-zinc-300">
          <div className="text-xl h-32 flex items-center justify-center">
            {alternatingStack('z', 1, 1, 4)}
          </div>
          <div className="text-xs whitespace-nowrap">threeDots + emptyCenterHigh</div>
          <div className="text-zinc-500 font-mono text-xs">alternating</div>
        </div>
      </div>
    </div>
    </div>
  );
}
