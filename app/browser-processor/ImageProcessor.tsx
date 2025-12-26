"use client";

import React, { useState, useRef, useCallback } from "react";
import { imageToMarksV2, GrayscaleImageData } from "../lib/unicode";

type SizeOption = "small" | "medium" | "large";

const SIZE_CONFIG = {
  small: { dimensions: 50, fontSize: "text-[16px]" },
  medium: { dimensions: 250, fontSize: "text-[6px]" },
  large: { dimensions: 500, fontSize: "text-[3px]" },
} as const;

interface ProcessedImage {
  original: string;
  marksOutput: React.ReactNode | null;
  rawText: string;
}

export function ImageProcessor() {
  const [size, setSize] = useState<SizeOption>("medium");
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageInBrowser = useCallback(
    async (file: File, sizeOption: SizeOption): Promise<ProcessedImage> => {
      const { dimensions } = SIZE_CONFIG[sizeOption];
      const width = dimensions;
      const height = dimensions;

      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const { data } = imageData;

          const pixels: number[][] = [];
          for (let x = 0; x < width; x++) {
            const column: number[] = [];
            for (let y = height - 1; y >= 0; y--) {
              const i = (y * width + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              column.push(1 - gray / 255);
            }
            pixels.push(column);
          }

          const grayscaleData: GrayscaleImageData = { width, height, pixels };
          const marksOutput = imageToMarksV2(grayscaleData, "");

          resolve({
            original: URL.createObjectURL(file),
            marksOutput,
            rawText: typeof marksOutput === "string" ? marksOutput : "",
          });
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load image"));
        };

        img.src = url;
      });
    },
    []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await processImageInBrowser(file, size);
      setProcessed(result);
    } catch (err) {
      console.error("Processing failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSizeChange = async (newSize: SizeOption) => {
    setSize(newSize);
    if (fileInputRef.current?.files?.[0]) {
      setIsProcessing(true);
      try {
        const result = await processImageInBrowser(fileInputRef.current.files[0], newSize);
        setProcessed(result);
      } catch (err) {
        console.error("Reprocessing failed:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCopy = async () => {
    if (processed?.rawText) {
      await navigator.clipboard.writeText(processed.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Try it yourself</h3>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Controls + Original */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-zinc-800 cursor-pointer"
            />
            <div className="flex gap-1">
              {(["small", "medium", "large"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSizeChange(option)}
                  disabled={isProcessing}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    size === option
                      ? "bg-black text-white"
                      : "bg-zinc-200 hover:bg-zinc-300"
                  } disabled:opacity-50`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="aspect-square bg-zinc-100 rounded-lg flex items-center justify-center overflow-hidden max-w-xs">
            {isProcessing ? (
              <p className="text-zinc-400 text-sm">Processing...</p>
            ) : processed ? (
              <img
                src={processed.original}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p className="text-zinc-400 text-sm">Upload an image</p>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-600">Output</span>
            {processed && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs font-medium bg-zinc-200 hover:bg-zinc-300 rounded transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="aspect-square bg-zinc-100 rounded-lg flex items-end justify-center overflow-clip max-w-xs">
            {processed ? (
              <div
                className={`whitespace-nowrap ${SIZE_CONFIG[size].fontSize}`}
                style={{ fontFamily: "var(--font-geist), sans-serif" }}
              >
                {processed.marksOutput}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm mb-auto mt-auto">Result appears here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
