'use client';

import { useState } from 'react';

export function Carousel({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          animation: 'scroll 40s linear infinite',
          animationPlayState: paused ? 'paused' : 'running'
        }}
      >
        {children}
      </div>
    </div>
  );
}
