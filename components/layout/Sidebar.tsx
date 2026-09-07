"use client";

import {
  Award,
  Briefcase,
  LayoutDashboard,
  Layers,
  Mail,
  UserRound,
  Webhook,
  X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile, socials } from "@/lib/data";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "api-playground", label: "API Playground", icon: Webhook },
  { id: "about", label: "About Me", icon: UserRound },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "contact", label: "Contact", icon: Mail },
];

type SidebarProps = {
  activeSection: string;
  open: boolean;
  onNavigate: (id: string) => void;
  onClose: () => void;
};

export function Sidebar({ activeSection, open, onNavigate, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform dark:border-neutral-800 dark:bg-neutral-800 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              GS
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-white">{profile.name}</p>
              <p className="text-xs text-neutral-400">{profile.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-primary-from to-primary-to text-white shadow-primary"
                    : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mx-4 mb-6 mt-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700">
          <p className="text-xs font-medium text-neutral-400">Availability</p>
          <p className="mt-1 text-sm font-semibold text-success">{profile.availability}</p>
          <div className="mt-3 flex gap-2">
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-card dark:bg-neutral-600 dark:text-neutral-200"
              aria-label="GitHub"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-card dark:bg-neutral-600 dark:text-neutral-200"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-card dark:bg-neutral-600 dark:text-neutral-200"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
