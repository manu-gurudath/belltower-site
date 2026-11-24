"use client";

import { useEffect } from "react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - (1 - t) ** 3;

/**
 * Drives --ping (0 → 1) on the dining group as its first screen scrolls into view:
 * the favorite-dish banner and its note slide down together.
 */
export function PingScroll() {
  useEffect(() => {
    const shot = document.querySelector<HTMLElement>(".ping-shot");
    const group = shot?.closest<HTMLElement>(".lp-group");
    if (!shot || !group) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      group.style.setProperty("--ping", "1");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = shot.getBoundingClientRect().top;
      // starts once the screen's top is halfway up the viewport, done just before it reaches the top
      group.style.setProperty("--ping", ease(clamp((vh * 0.8 - top) / (vh * 0.45))).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);
  return null;
}
