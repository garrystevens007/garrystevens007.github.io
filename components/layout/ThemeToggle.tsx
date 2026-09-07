"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

// Tiny external store over document.documentElement's "dark" class, so the
// toggle icon updates immediately on click while staying hydration-safe
// (server always renders the light-mode icon; the inline script in
// app/layout.tsx already set the real class before this hydrates, and
// useSyncExternalStore reconciles the mismatch on mount without a flash of
// incorrect content warning).
type Listener = () => void;
const listeners = new Set<Listener>();
let cachedIsDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedIsDark;
}

function getServerSnapshot() {
  return false;
}

function setTheme(isDark: boolean) {
  cachedIsDark = isDark;
  document.documentElement.classList.toggle("dark", isDark);
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {
    // localStorage unavailable (e.g. private mode) — theme just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(!isDark)}
      aria-label="Toggle dark mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
