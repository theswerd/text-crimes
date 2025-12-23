'use client';

import { useState } from 'react';
import { MARKS } from '../lib/unicode';

export default function CalibrationPage() {
  const [aboveSeen, setAboveSeen] = useState(50);
  const [belowSeen, setBelowSeen] = useState(50);
  const [aboveMeem, setAboveMeem] = useState(38);
  const [belowMeem, setBelowMeem] = useState(44);
  const [aboveEmpty, setAboveEmpty] = useState(50);
  const [belowEmpty, setBelowEmpty] = useState(50);

  return (
    <main className="min-h-screen bg-white text-black p-8 flex">
      <div className="flex-1 pr-8">
        <h1 className="text-2xl font-bold mb-4">Mark Height Calibration</h1>
        <p className="text-zinc-500 mb-8">
          Adjust counts until all columns match in height. When equal, the ratios show relative mark heights.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm mb-1">above.seen: {aboveSeen}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={aboveSeen}
              onChange={(e) => setAboveSeen(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">above.meemIsolated: {aboveMeem}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={aboveMeem}
              onChange={(e) => setAboveMeem(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">above.emptyCenterHigh: {aboveEmpty}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={aboveEmpty}
              onChange={(e) => setAboveEmpty(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">below.seen: {belowSeen}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={belowSeen}
              onChange={(e) => setBelowSeen(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">below.lowMeem: {belowMeem}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={belowMeem}
              onChange={(e) => setBelowMeem(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">below.emptyCenter: {belowEmpty}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={belowEmpty}
              onChange={(e) => setBelowEmpty(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-4 bg-zinc-100 rounded text-sm font-mono">
          <p>above.meemIsolated = {aboveSeen}/{aboveMeem} ≈ {(aboveSeen / aboveMeem).toFixed(3)} × above.seen</p>
          <p>above.emptyCenterHigh = {aboveSeen}/{aboveEmpty} ≈ {(aboveSeen / aboveEmpty).toFixed(3)} × above.seen</p>
          <p>below.lowMeem = {belowSeen}/{belowMeem} ≈ {(belowSeen / belowMeem).toFixed(3)} × below.seen</p>
          <p>below.emptyCenter = {belowSeen}/{belowEmpty} ≈ {(belowSeen / belowEmpty).toFixed(3)} × below.seen</p>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center"
        style={{
          fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
        }}
      >
        {'g' + MARKS.above.seen.repeat(aboveSeen) + MARKS.below.seen.repeat(belowSeen)}
        {'g' + MARKS.above.meemIsolated.repeat(aboveMeem) + MARKS.below.lowMeem.repeat(belowMeem)}
        {'g' + MARKS.above.emptyCenterHigh.repeat(aboveEmpty) + MARKS.below.emptyCenter.repeat(belowEmpty)}
      </div>
    </main>
  );
}
