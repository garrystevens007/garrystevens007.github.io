"use client";

import { useEffect, useRef } from "react";

// Full-page particle network — sits fixed behind everything (-z-10), drawn
// with a fully transparent clear each frame so the theme-aware body
// background (bg-neutral-100 / dark:bg-neutral-900, from globals.css) shows
// through untouched. Cards/sidebar/navbar are all opaque, so this is only
// visible in the negative space around them — and through the navbar's own
// backdrop-blur, which picks up a nice frosted glimpse of it scrolling past.
//
// Color is the exact `info` gradient's lighter stop (#49a3f1 / rgb(73,163,241))
// already in tailwind.config.ts — same sourced palette, not a new color pick.
// Only *intensity* (opacity/glow) differs between themes, not the hue itself.

const DOT_RGB = "73, 163, 241";
const CONNECT_DISTANCE = 130;
// The cursor always connects to its N nearest particles (capped by a max
// distance so it doesn't draw across an empty screen), rather than whatever
// happens to fall within a fixed radius — a radius-only approach could mean
// zero connections in sparser areas, which reads as "hovering does nothing."
const CURSOR_NEAREST_COUNT = 6;
const CURSOR_MAX_CONNECT_DISTANCE = 260;
const CURSOR_REPEL_DISTANCE = 90;

type Particle = {
  x: number;
  y: number;
  // Constant ambient drift — never decays, this is what keeps the network
  // perpetually alive rather than settling into stillness.
  baseVx: number;
  baseVy: number;
  // Temporary push from cursor repulsion, on top of the base drift — this is
  // the only velocity component that decays (see the drag comment in step()).
  impulseVx: number;
  impulseVy: number;
  radius: number;
  phase: number; // for a subtle per-particle twinkle
};

function particleCountFor(width: number, height: number): number {
  const area = width * height;
  // ~1 particle per 5,500px², clamped so small/mobile viewports still get a
  // dense web and ultra-wide monitors don't get thousands (was /9000, 70-260
  // — increased again on request for a denser network).
  return Math.max(90, Math.min(360, Math.round(area / 5500)));
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let isDark = document.documentElement.classList.contains("dark");
    let animationFrame = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    function makeParticles(w: number, h: number): Particle[] {
      const count = particleCountFor(w, h);
      return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        baseVx: (Math.random() - 0.5) * 0.36,
        baseVy: (Math.random() - 0.5) * 0.36,
        impulseVx: 0,
        impulseVy: 0,
        radius: 1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Backing-store resolution (device pixels) vs. CSS display size (layout
      // pixels) are two different things for a canvas, and MUST be set
      // separately. A <canvas> is a "replaced element" with an intrinsic
      // size equal to its width/height *attributes* — per the CSS spec,
      // that intrinsic size wins over `inset-0`'s stretch-to-fill behavior
      // for a replaced element with no explicit CSS width/height (unlike a
      // plain div, which would stretch). Without the two lines below, the
      // canvas's on-screen box silently becomes width*dpr × height*dpr CSS
      // pixels — e.g. 2160×1350 instead of 1440×900 at 1.5x display scaling
      // — while all of this file's own math (mouse position, particle
      // bounds) still assumes window.innerWidth/innerHeight. That mismatch
      // is exactly what caused the reported "dot isn't on the pointer" bug:
      // confirmed via getBoundingClientRect() showing the inflated box size,
      // and the cursor dot landing hundreds of pixels off at 1.5x scaling.
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = makeParticles(width, height);
    }

    function drawFrame(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const dotAlpha = isDark ? 0.85 : 0.45;
      const lineAlphaMax = isDark ? 0.32 : 0.12;
      const cursorAlphaMax = isDark ? 0.5 : 0.22;

      if (isDark) {
        ctx.shadowColor = `rgba(${DOT_RGB}, 0.9)`;
        ctx.shadowBlur = 6;
      } else {
        ctx.shadowBlur = 0;
      }

      // Particle-particle connections (checked once per pair)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DISTANCE) {
            const alpha = lineAlphaMax * (1 - dist / CONNECT_DISTANCE);
            ctx.strokeStyle = `rgba(${DOT_RGB}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots (with a slow per-particle twinkle)
      for (const p of particles) {
        const twinkle = 0.75 + 0.25 * Math.sin(time * 0.0012 + p.phase);
        ctx.fillStyle = `rgba(${DOT_RGB}, ${dotAlpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor -> nearest-neighbor connections, drawn last so they (and the
      // cursor's own glowing node) sit on top of everything else — a clear
      // "you're now part of the network" highlight, not lost among the
      // ambient particle-particle lines underneath.
      if (mouse.active) {
        const nearest = particles
          .map((p) => ({ p, dist: Math.hypot(p.x - mouse.x, p.y - mouse.y) }))
          .filter((entry) => entry.dist < CURSOR_MAX_CONNECT_DISTANCE)
          .sort((entryA, entryB) => entryA.dist - entryB.dist)
          .slice(0, CURSOR_NEAREST_COUNT);

        ctx.lineWidth = 1.2;
        for (const { p, dist } of nearest) {
          const proximity = 1 - dist / CURSOR_MAX_CONNECT_DISTANCE;
          // Floored so even the farthest of the "nearest N" stays visible —
          // the point is a reliable, obvious connection, not one that fades
          // to nothing right as it's guaranteed to appear.
          const alpha = cursorAlphaMax * Math.max(proximity, 0.35);
          ctx.strokeStyle = `rgba(${DOT_RGB}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.shadowColor = `rgba(${DOT_RGB}, 0.9)`;
        ctx.shadowBlur = isDark ? 14 : 8;
        ctx.fillStyle = `rgba(${DOT_RGB}, ${isDark ? 0.95 : 0.7})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    }

    function step(time: number) {
      if (!running) return;

      for (const p of particles) {
        // Gentle repulsion from the cursor — particles part ways as you move
        // through them, then drift back to their normal wander. This only
        // ever touches the *impulse* component, never the base drift, so the
        // ambient motion can't decay away — that was the bug: applying drag
        // to the base velocity every frame made every particle grind to a
        // halt within a few seconds, animation loop still running or not.
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CURSOR_REPEL_DISTANCE && dist > 0.01) {
            const force = (1 - dist / CURSOR_REPEL_DISTANCE) * 0.6;
            p.impulseVx += (dx / dist) * force * 0.05;
            p.impulseVy += (dy / dist) * force * 0.05;
          }
        }

        p.x += p.baseVx + p.impulseVx;
        p.y += p.baseVy + p.impulseVy;
        // Drag on the impulse only, so a cursor push fades back to the
        // particle's normal constant drift instead of accumulating forever.
        p.impulseVx *= 0.95;
        p.impulseVy *= 0.95;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      drawFrame(time);
      animationFrame = requestAnimationFrame(step);
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrame);
      } else if (!prefersReducedMotion) {
        running = true;
        animationFrame = requestAnimationFrame(step);
      }
    }

    // Theme can change live via the toggle — watch the <html> class instead
    // of reading it once, so particle color intensity updates immediately.
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
      if (prefersReducedMotion) drawFrame(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (prefersReducedMotion) {
      // Respect the OS setting: render one static frame, no motion, no
      // cursor interaction loop — still visually present, just not animated.
      drawFrame(0);
    } else {
      animationFrame = requestAnimationFrame(step);
    }

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />;
}
