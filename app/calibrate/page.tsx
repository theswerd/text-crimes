"use client";

import { useState } from "react";
import { ALL_ABOVE } from "../lib/unicode";

const REFERENCE_COUNT = 50;

interface CalibrationData {
  name: string;
  char: string;
  unicode: string;
  count: number;
  included: boolean;
}

export default function CalibratePage() {
  const [calibrations, setCalibrations] = useState<CalibrationData[]>(() =>
    ALL_ABOVE.map(({ name, char }) => ({
      name,
      char,
      unicode: `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`,
      count: REFERENCE_COUNT,
      included: true,
    }))
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCountChange = (index: number, count: number) => {
    setCalibrations((prev) =>
      prev.map((cal, i) => (i === index ? { ...cal, count } : cal))
    );
  };

  const handleToggleIncluded = (index: number) => {
    setCalibrations((prev) =>
      prev.map((cal, i) => (i === index ? { ...cal, included: !cal.included } : cal))
    );
  };

  // Find 'seen' count as reference for ratio calculation
  const seenCal = calibrations.find((c) => c.name === "seen");
  const seenCount = seenCal?.count || REFERENCE_COUNT;

  const exportData = () => {
    const includedCals = calibrations.filter((cal) => cal.included);
    const output = {
      reference: "seen",
      referenceCount: seenCount,
      marks: Object.fromEntries(
        includedCals.map((cal) => [
          cal.name,
          {
            char: cal.char,
            unicode: cal.unicode,
            count: cal.count,
            heightRatio: Math.round((seenCount / cal.count) * 1000) / 1000,
          },
        ])
      ),
    };
    return JSON.stringify(output, null, 2);
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-4">Above Mark Calibration</h1>
      <p className="text-gray-600 mb-4">
        Adjust counts until all marks reach the same height. Ratio is auto-calculated relative to &quot;seen&quot;.
      </p>

      <div className="mb-8">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {copied ? "Copied!" : "Copy JSON"}
        </button>
      </div>

      {/* All marks side by side on one line, centered */}
      <div
        className="text-4xl leading-none mb-8 pt-[400px] flex justify-center"
        style={{ fontFamily: "var(--font-geist), sans-serif" }}
      >
        {calibrations.map((cal, index) => (
          <span
            key={cal.name}
            onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
            className={`cursor-pointer ${
              !cal.included
                ? "text-gray-300"
                : selectedIndex === index
                  ? "text-red-500"
                  : "text-blue-600"
            }`}
          >
            |{cal.char.repeat(cal.count)}
          </span>
        ))}
      </div>

      {/* Count inputs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {calibrations.map((cal, index) => (
          <div
            key={cal.name}
            onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
            className={`flex items-center gap-2 text-sm cursor-pointer rounded px-2 py-1 ${
              selectedIndex === index ? "bg-red-100" : ""
            } ${!cal.included ? "opacity-40" : ""}`}
          >
            <input
              type="checkbox"
              checked={cal.included}
              onClick={(e) => e.stopPropagation()}
              onChange={() => handleToggleIncluded(index)}
              className="w-4 h-4"
            />
            <span className={`font-mono w-6 ${selectedIndex === index ? "text-red-500" : "text-gray-500"}`}>{index + 1}.</span>
            <span className={`font-bold w-28 ${selectedIndex === index ? "text-red-500" : ""}`}>{cal.name}</span>
            <input
              type="number"
              step="1"
              value={cal.count}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                handleCountChange(index, parseInt(e.target.value) || 1)
              }
              className="w-16 border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>

      {/* JSON Preview */}
      <h2 className="text-xl font-bold mb-2">JSON</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm max-h-64 overflow-auto">
        {exportData()}
      </pre>
    </main>
  );
}
