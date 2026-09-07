"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
};

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded px-3 py-1 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
        copied ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {copied ? "✓ Copied!" : "📋 Copy"}
    </button>
  );
}
