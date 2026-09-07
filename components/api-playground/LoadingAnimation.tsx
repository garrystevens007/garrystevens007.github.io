"use client";

import { useEffect, useState } from "react";
import { apiPlaygroundLoadingMessages } from "@/lib/data";

// Picks one message per mount (i.e. once per "SEND" click, since the parent
// unmounts/remounts this while isLoading is true) and types it out letter by
// letter, matching agentsmd/UI_COMPONENTS.md's terminal-style loading state.
export function LoadingAnimation() {
  const [message] = useState(
    () => apiPlaygroundLoadingMessages[Math.floor(Math.random() * apiPlaygroundLoadingMessages.length)]
  );
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(message.slice(0, index));
      if (index >= message.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center py-8" role="status" aria-live="polite">
      <div className="relative mb-4 h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />
      </div>
      <p className="min-h-6 text-center text-sm text-gray-600">{displayedText}</p>
      <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
        <div className="animate-progress h-full bg-pink-600" />
      </div>
    </div>
  );
}
