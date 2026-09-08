"use client";

import { useEffect, useRef } from "react";
import type { UserRole } from "@/lib/roles";

// (see lerpHue / fieldAngle below — module-level so they aren't re-created)

// Living background for the role picker.
//
// Deliberately NOT the same effect as the portfolio's particle network — two
// pages running an identical constellation would read as one idea reused. This
// is a flow field: every particle is advected through a smooth, slowly
// evolving vector field and leaves a fading trail, which produces silky
// ribbons rather than a web of lines.
//
// It also does one thing the network can't: hovering a role card pulls every
// particle's hue toward that dashboard's accent (teal / pink / gold), so the
// background previews the choice you're about to make.
//
// Perf notes (same discipline as ParticleBackground):
//  - No canvas shadows anywhere. Trails come from an alpha fade, not blur.
//  - Hues are quantised into HUE_BUCKETS and each bucket is stroked as ONE
//    path, so the whole field costs ~24 stroke() calls per frame rather than
//    one per particle.
//  - The fade uses `destination-out` so the canvas stays transparent over the
//    CSS gradient underneath, instead of the canvas having to paint its own
//    opaque background.

const HUE_BUCKETS = 24;
// Lower = longer-lived trails. 0.03 keeps a ribbon visible for ~30 frames.
const TRAIL_FADE = 0.03;
const CURSOR_RADIUS = 200;
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;
// The field is drawn at 1 device pixel per CSS pixel regardless of screen
// density. At 2x this effect cost 4x the fill for no visible gain — soft
// ribbons are exactly the kind of content that survives being upscaled, and
// this alone took the picker from 26fps to comfortably above 60.
const RENDER_SCALE = 1;

// Hue (HSL degrees) each role pulls the field toward — matched to that
// dashboard's actual accent: teal #0F766E, pink #e91e63, gold #D4AF37.
const ROLE_HUE: Record<UserRole, number> = {
  hr: 174,
  technical: 336,
  manager: 44,
};

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  speed: number;
  hue: number;
  life: number;
  maxLife: number;
};

// Fewer, bolder, faster ribbons read far better than a haze of faint ones —
// the first attempt used ~810 slow particles and looked like paper texture.
function particleCountFor(width: number, height: number): number {
  return Math.max(160, Math.min(560, Math.round((width * height) / 2600)));
}

/** Smooth, slowly-evolving angle field. Three octaves is enough to stop it
 *  looking like a regular grid without costing real time. */
function fieldAngle(x: number, y: number, t: number): number {
  const s = 0.0018;
  return (
    (Math.sin(x * s + t * 0.3) * 1.2 +
      Math.cos(y * s * 1.15 - t * 0.22) * 1.2 +
      Math.sin((x + y) * s * 0.55 + t * 0.16) * 0.9) *
    1.1
  );
}

/** Lerp around the colour wheel the short way, so teal→pink doesn't sweep
 *  through the entire spectrum on its way. */
function lerpHue(from: number, to: number, amount: number): number {
  const delta = ((to - from + 540) % 360) - 180;
  return (from + delta * amount + 360) % 360;
}

export function FlowFieldBackground({ activeRole }: { activeRole: UserRole | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The animation loop reads this rather than closing over the prop, so
  // hovering a card retints the field instead of tearing it down and
  // restarting it. Synced in an effect, not during render — writing a ref
  // mid-render is exactly what React 19's refs rule forbids.
  const activeRoleRef = useRef<UserRole | null>(activeRole);

  useEffect(() => {
    activeRoleRef.current = activeRole;
  }, [activeRole]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let animationFrame = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const buckets: number[][] = Array.from({ length: HUE_BUCKETS }, () => []);

    function spawn(w: number, h: number): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        px: 0,
        py: 0,
        speed: 1.2 + Math.random() * 1.7,
        // Base spread runs cyan → blue → violet → pink, echoing the page's own
        // gradient, so the resting state feels of a piece with it.
        hue: 190 + Math.random() * 145,
        life: 0,
        maxLife: 160 + Math.random() * 340,
      };
    }

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = RENDER_SCALE;
      // Same replaced-element trap documented at length in
      // ParticleBackground: the backing store and the CSS box are separate
      // and both must be set, or the cursor interaction lands off-target.
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: particleCountFor(width, height) }, () =>
        spawn(width, height)
      );
      // Reset accumulated trails; stale ones would be stretched by the new
      // transform.
      ctx.clearRect(0, 0, width, height);
    }

    function stepParticles(t: number) {
      const target = activeRoleRef.current ? ROLE_HUE[activeRoleRef.current] : null;

      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;

        let angle = fieldAngle(p.x, p.y, t);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CURSOR_RADIUS_SQ && distSq > 1) {
            // A true vortex: blend the particle's heading toward the tangent
            // of the circle around the pointer. Particles orbit rather than
            // simply flee, which is what makes it feel like stirring
            // something instead of repelling it. Shortest-arc blend so the
            // heading never whips the long way round.
            const falloff = 1 - Math.sqrt(distSq) / CURSOR_RADIUS;
            const tangential = Math.atan2(dy, dx) + Math.PI / 2;
            const turn = ((tangential - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
            angle += turn * falloff * 0.85;
          }
        }

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        if (target !== null) {
          p.hue = lerpHue(p.hue, target, 0.035);
        }

        p.life++;
        // Respawn on death or when off-screen. Without the lifespan, every
        // particle eventually settles into the field's attractor basins and
        // the motion visibly dies — the same class of bug as the network's
        // decaying drift, just via a different mechanism.
        if (
          p.life > p.maxLife ||
          p.x < -40 ||
          p.x > width + 40 ||
          p.y < -40 ||
          p.y > height + 40
        ) {
          const fresh = spawn(width, height);
          // Keep the hue so a respawn doesn't flicker back to the base
          // spread mid-hover.
          fresh.hue = target !== null ? p.hue : fresh.hue;
          Object.assign(p, fresh);
          p.px = p.x;
          p.py = p.y;
        }
      }
    }

    function drawFrame() {
      if (!ctx) return;

      // Fade what's already there toward transparent — this is the trail.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      for (let b = 0; b < HUE_BUCKETS; b++) buckets[b].length = 0;

      for (const p of particles) {
        let bucket = ((p.hue / 360) * HUE_BUCKETS) | 0;
        if (bucket >= HUE_BUCKETS) bucket = HUE_BUCKETS - 1;
        if (bucket < 0) bucket = 0;
        buckets[bucket].push(p.px, p.py, p.x, p.y);
      }

      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (let b = 0; b < HUE_BUCKETS; b++) {
        const segments = buckets[b];
        if (segments.length === 0) continue;
        const hue = ((b + 0.5) / HUE_BUCKETS) * 360;
        // Saturated and a touch darker than mid: the page background is pale,
        // so additive blending would wash to white and a light stroke would
        // simply disappear into it.
        ctx.strokeStyle = `hsla(${hue}, 80%, 52%, 0.62)`;
        ctx.beginPath();
        for (let s = 0; s < segments.length; s += 4) {
          ctx.moveTo(segments[s], segments[s + 1]);
          ctx.lineTo(segments[s + 2], segments[s + 3]);
        }
        ctx.stroke();
      }
    }

    function loop(now: number) {
      if (!running) return;
      const t = now * 0.001;
      stepParticles(t);
      drawFrame();
      animationFrame = requestAnimationFrame(loop);
    }

    function handlePointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function handlePointerLeave() {
      mouse.active = false;
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrame);
      } else if (!prefersReducedMotion && !running) {
        running = true;
        animationFrame = requestAnimationFrame(loop);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (prefersReducedMotion) {
      // Render a still frame of the field rather than nothing — the page keeps
      // its texture, it just doesn't move.
      running = false;
      for (let i = 0; i < 140; i++) {
        stepParticles(i * 0.016);
        drawFrame();
      }
    } else {
      animationFrame = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    // No mix-blend-mode: a blend mode on a full-viewport, every-frame-dirty
    // element forces the compositor to re-blend the whole page each frame,
    // which was over half the cost here. Plain alpha, tuned colours instead.
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 opacity-80" />
  );
}
