"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ParticleBackground } from "./ParticleBackground";

const sectionIds = ["overview", "api-playground", "about", "experience", "skills", "certifications", "contact"];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function handleNavigate(id: string) {
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* Base page color is still bg-neutral-100/dark:bg-neutral-900 from
          body (globals.css) — this just adds the particle network on top of
          it, behind everything, visible only in the gaps around the opaque
          sidebar/navbar/cards. */}
      <ParticleBackground />
      <Sidebar
        activeSection={activeSection}
        open={sidebarOpen}
        onNavigate={handleNavigate}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1">
        <Navbar activeSection={activeSection} onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
