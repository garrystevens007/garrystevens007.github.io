"use client";

import { useId, useState } from "react";
import type { Role } from "@/lib/data";

// One row per role, only one open at a time, the first open on load. The row is a real <button> inside an <h3>;
// the panel animates its height with the grid-rows 0fr→1fr trick, and nothing animates with reduced motion.
export function ExperienceAccordion({ items }: { items: Role[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <ol className="list-none border-b border-rule p-0">
      {items.map((role, i) => {
        const isOpen = i === open;
        const btnId = `${base}-exp-${i}`;
        const panelId = `${base}-expb-${i}`;
        return (
          <li key={`${role.company}-${role.start}`} className="border-t border-rule">
            <h3 className="m-0 font-sans">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_28px] items-baseline gap-2 border-0 bg-transparent py-7 text-left text-ink nav:grid-cols-[200px_minmax(0,1fr)_32px] nav:gap-6"
              >
                <span className="col-span-full font-mono text-[13px] text-muted nav:col-span-1">{role.period}</span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-2xl font-semibold leading-tight tracking-[-0.02em]">
                    {role.role} · {role.company}
                  </span>
                  <span className="text-[15px] text-muted">{role.location.replace(", ", " · ")}</span>
                </span>
                <span aria-hidden="true" className="text-right text-[22px] text-muted">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="flex flex-col gap-3.5 pb-8 nav:pl-[224px] nav:pr-14"
                >
                  <p className="m-0 max-w-[40em] text-[17px] text-ink-2">{role.summary}</p>
                  <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-ink-2">
                    {role.bullets.map((b) => (
                      <li key={b} className="max-w-[46em]">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex min-h-[26px] items-center rounded-full bg-alt px-2.5 font-mono text-xs text-ink-2"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
