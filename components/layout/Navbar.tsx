"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const sectionTitles: Record<string, string> = {
  overview: "Overview",
  "api-playground": "API Playground",
  about: "About Me",
  experience: "Experience",
  skills: "Skills",
  certifications: "Certifications",
  contact: "Contact",
};

type NavbarProps = {
  activeSection: string;
  onMenuClick: () => void;
};

export function Navbar({ activeSection, onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="text-xs text-neutral-400">Dashboard</p>
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">
            {sectionTitles[activeSection] ?? "Overview"}
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
