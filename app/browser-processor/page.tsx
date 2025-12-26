import type { Metadata } from "next";
import { ImageProcessor } from "./ImageProcessor";
import { BrowserWarning } from "../components/BrowserWarning";

export const metadata: Metadata = {
  title: "Browser Image Processor - Text Crimes",
  description: "Convert any image to Unicode stacking marks directly in your browser",
};

export default function BrowserProcessorPage() {
  return (
    <main className="min-h-screen bg-white text-black p-8">
      <BrowserWarning />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Browser Image Processor</h1>
        <p className="text-zinc-500 mb-8">
          Convert any image to Unicode Tajweed stacking marks entirely in your browser.
          No server required - all processing happens locally using the Canvas API.
        </p>
        <ImageProcessor />
        <div className="mt-12 pt-8 border-t text-sm text-zinc-500">
          <a href="/" className="underline hover:text-black">
            ← Back to main page
          </a>
        </div>
      </div>
    </main>
  );
}
