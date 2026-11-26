"use client";

import { useEffect, useRef, useState } from "react";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// hero.jpg is a composite: the lock screen (a 235.8 x 511.2 box) placed on the
// phone with this matrix3d, in a frame where the photo is 200px wide.
const FRAME_W = 200;
const SCREEN_M = [
  0.111531, 0.0541965, 0, 4.24799e-7, -0.0614617, 0.0826606, 0, -0.000128082, 0,
  0, 1, 0, 98.3319, 96.2901, 0, 1,
];
// The Live Activity card on that lock screen, in the same 235.8-wide units
const CARD = { x0: 9.23, y0: 298.67, x1: 227.36, y1: 387.48 };

const CLASS_SECONDS = 80 * 60; // 3:30 – 4:50 PM
const pad = (n: number) => String(n).padStart(2, "0");
const hms = (t: number) => `${Math.floor(t / 3600)}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - (1 - t) ** 3;

function onScreen(x: number, y: number, f: number) {
  const m = SCREEN_M;
  const w = m[3] * x + m[7] * y + m[15];
  return [
    ((m[0] * x + m[4] * y + m[12]) / w) * f,
    ((m[1] * x + m[5] * y + m[13]) / w) * f,
  ];
}

/** Projective transform taking 4 points `from` onto 4 points `to`, as a CSS matrix3d. */
function homography(from: number[][], to: number[][]) {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i];
    const [u, v] = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let piv = c;
    for (let r = c + 1; r < 8; r++)
      if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  const h = A.map((row, i) => row[8] / row[i]);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
}

/**
 * The hero photo stays still. As you start scrolling, a sharp copy of the Live
 * Activity lifts off the phone: it starts exactly on the phone's screen, in the
 * photo's perspective, then flattens and slides out to float over the photo's edge.
 * Its layout size is its final size, so it is only ever drawn at 1:1 or smaller.
 */
export function HeroPhoto() {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [landed, setLanded] = useState(false);
  const [left, setLeft] = useState(1);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!landed) {
      setLive(false);
      setLeft(1);
      return;
    }
    if (!live && left === 0) {
      const t = setTimeout(() => {
        setLive(true);
        setLeft(CLASS_SECONDS);
      }, 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLeft((v) => Math.max(0, v - 1)), live ? 1000 : 900);
    return () => clearTimeout(t);
  }, [landed, live, left]);

  useEffect(() => {
    const el = wrap.current!;
    const cd = card.current!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = innerHeight;
      const pw = el.offsetWidth;
      const ph = el.offsetHeight;
      const cw = cd.offsetWidth;
      const ch = cd.offsetHeight;

      // Start: the card's corners on the phone
      const f = pw / FRAME_W;
      const start = [
        onScreen(CARD.x0, CARD.y0, f),
        onScreen(CARD.x1, CARD.y0, f),
        onScreen(CARD.x1, CARD.y1, f),
        onScreen(CARD.x0, CARD.y1, f),
      ];
      // End: flat, hanging off the photo's left edge (centred below it when stacked)
      const stacked =
        getComputedStyle(el).getPropertyValue("--lift-stacked").trim() === "1";
      const ex = stacked ? (pw - cw) / 2 : -cw * 0.32;
      const ey = ph - ch * 0.55;
      const end = [
        [ex, ey],
        [ex + cw, ey],
        [ex + cw, ey + ch],
        [ex, ey + ch],
      ];

      // Progress: wait a little longer on stacked phone layouts so the activity
      // does not start moving as soon as the hero first enters the viewport.
      const top = el.getBoundingClientRect().top + scrollY;
      const from = Math.max(0, top + ph * 0.55 - vh);
      const startDelay = stacked ? vh * 0.18 : 0;
      const p = still ? 1 : ease(clamp((scrollY - from - startDelay) / (vh * 0.35)));

      const now = start.map((s, i) => [
        s[0] + (end[i][0] - s[0]) * p,
        s[1] + (end[i][1] - s[1]) * p,
      ]);
      cd.style.transform = homography(
        [
          [0, 0],
          [cw, 0],
          [cw, ch],
          [0, ch],
        ],
        now,
      );
      cd.style.opacity = String(clamp(p * 6));
      cd.style.setProperty("--lift", String(p));
      // Start the countdown once it has landed; reset if scrolled back to the photo
      if (p > 0.98) setLanded(true);
      else if (p < 0.3) setLanded(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="lp-hero-media" ref={wrap}>
      <img
        className="lp-hero-photo"
        src={`${base}/hero.jpg`}
        alt="Someone on a stairway holding an iPhone, its Lock Screen showing a Belltower class countdown"
        width={1350}
        height={1800}
        fetchPriority="high"
      />
      <div className="lift lp-keep" ref={card}>
        <div className={live ? "lift-card is-live" : "lift-card"} aria-hidden>
          <div className="lift-main">
            <span className="lift-tower">
              <img src={`${base}/tower.png`} alt="" />
            </span>
            <div className="lift-body">
              <div className="lift-top">
                <div className="lift-info">
                  <b className="lift-code">WRIT 010S</b>
                  <span className="lift-sub">Lecture 007 · Anne Sullivan</span>
                </div>
                <div className="lift-slot">
                  <span className="lift-dir lift-pre">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <circle cx="5" cy="17" r="2.6" />
                      <circle cx="19" cy="17" r="2.6" />
                      <path d="M5 17h9l3-9h3M14 17l-2-6" />
                    </svg>
                    Directions
                  </span>
                  <span className="lift-roomtop lift-in">
                    <span className="lift-lbl">ROOM</span>
                    <b>1102</b>
                  </span>
                </div>
              </div>
              <div className="lift-bottom">
                <div className="lift-row lift-pre">
                  <div>
                    <span className="lift-lbl">ROOM</span>
                    <b className="lift-room">1102</b>
                  </div>
                  <div className="lift-end">
                    <span className="lift-lbl">STARTS IN</span>
                    <b className="lift-count">00:{pad(live ? 0 : left)}</b>
                  </div>
                </div>
                <div className="lift-in lift-left">
                  <p>
                    <b>{hms(live ? left : CLASS_SECONDS)}</b> left
                  </p>
                  <span className="lift-progress">
                    <i style={{ width: `${live ? (1 - left / CLASS_SECONDS) * 100 : 0}%` }} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lift-bar">
            <span>Sproul Hall</span>
            <span className="lift-range">3:30 PM – 4:50 PM</span>
          </div>
        </div>
        <p className="lift-note">
          <span>
            <strong>live activities</strong> and <strong>dynamic island</strong> count down to class, then to when it
            ends
          </span>
          <svg viewBox="0 0 48 40" aria-hidden>
            <path d="M4 34c14 2 26-6 34-24" />
            <path d="M30 12l8-3 3 8" />
          </svg>
        </p>
      </div>
    </div>
  );
}
