'use client';

import { useEffect, useState } from 'react';

export function BrowserWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if browser is Chromium-based
    const isChromium = !!(window as unknown as { chrome?: unknown }).chrome;
    setShowWarning(!isChromium);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="bg-amber-100 border-b border-amber-300 px-12 py-3 text-amber-800">
      <strong>Warning:</strong> This article is best viewed in a Chromium-based browser (Chrome, Edge, Vivaldi, etc.) for intended rendering of stacking marks.
    </div>
  );
}
