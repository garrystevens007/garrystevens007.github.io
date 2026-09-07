"use client";

import { useSyncExternalStore } from "react";

// Generic localStorage-backed external store. Reading persisted state
// directly in a mount effect (setState-in-effect) risks a real hydration
// mismatch — the server and the first client render both show the empty
// fallback, then a later render (once mounted) would suddenly show different
// content, which for a list can flip from "renders nothing" to "renders
// items". useSyncExternalStore is the pattern React actually recommends for
// this: server and first-client-pass both use getServerSnapshot (the
// fallback), then React reconciles to the real getSnapshot value right after
// hydration — same approach as components/layout/ThemeToggle.tsx, generalized
// for arbitrary JSON-serializable state instead of just a boolean.

type Listener = () => void;

export function createLocalStorageStore<T>(key: string, fallback: T) {
  let cached: T = fallback;
  let loaded = false;
  const listeners = new Set<Listener>();

  function load(): T {
    if (loaded) return cached;
    loaded = true;
    if (typeof window === "undefined") return cached;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) cached = JSON.parse(raw) as T;
    } catch {
      // Corrupt or inaccessible storage — fall back to the default.
    }
    return cached;
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot(): T {
    return load();
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  function set(updater: T | ((prev: T) => T)) {
    const prev = load();
    const next = typeof updater === "function" ? (updater as (value: T) => T)(prev) : updater;
    cached = next;
    loaded = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage unavailable (e.g. private mode) — stays in-memory for this session.
    }
    listeners.forEach((listener) => listener());
  }

  return { subscribe, getSnapshot, getServerSnapshot, set };
}

export function useLocalStorageStore<T>(
  store: ReturnType<typeof createLocalStorageStore<T>>
): [T, (updater: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return [value, store.set];
}
