'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-4 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded text-sm"
    >
      {copied ? 'Copied!' : 'Copy to clipboard'}
    </button>
  );
}
