"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { BLOCKS, ClassesScreen, StatusBar } from "./classes-screen";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// `own`: Home and Lock Screen shots keep their own status bar; app screens share one
type Shot = { file: string; alt: string; w: number; own?: boolean };
type Chapter = { id: string; q: string; label: ReactNode; shots: Shot[]; home?: boolean };

const keep = (t: string) => <span className="lp-keep">{t}</span>;

// One pinned phone walks through every feature. A chapter's scroll length is the sum of its
// shots' weights, so a new feature adds one chapter instead of another row of screenshots.
const CHAPTERS: Chapter[] = [
  {
    id: "dining",
    q: "what’s for dinner?",
    label: "all four halls · nutrition · diet filters",
    shots: [
      { file: "dining", alt: "Glasgow dinner menu by station, with a notification that a favorite dish is being served", w: 1 },
      { file: "nutrition", alt: "Nutrition facts for a dish", w: 0.55 },
    ],
  },
  {
    id: "classes",
    q: "who’s in class with you?",
    label: <>import from {keep("R’Web")} · friends · seats · ratings</>,
    shots: [
      { file: "classes", alt: "Your week of classes, with Leo and Maya lit up because they are in CS 010B with you right now", w: 1.5 },
      { file: "professor", alt: "Professor ratings and student reviews", w: 0.55 },
    ],
  },
  {
    id: "rooms",
    q: "need a quiet room?",
    label: <>{keep("Rivera")} & {keep("Orbach")}, 7 days out</>,
    shots: [{ file: "library", alt: "Study room availability at Rivera", w: 0.8 }],
  },
  {
    id: "gym",
    q: "is the gym packed?",
    label: <>live {keep("SRC")} headcounts · your pass in one tap</>,
    shots: [{ file: "src", alt: "Live SRC headcounts by area, and your SRC pass barcode", w: 1.1 }],
  },
  {
    id: "events",
    q: "anything going on?",
    label: "campus events · 600+ clubs",
    shots: [
      { file: "events", alt: "Campus events list", w: 0.7 },
      { file: "clubs", alt: "Clubs directory with saved clubs", w: 0.7 },
    ],
  },
  {
    id: "safety",
    q: "is campus okay?",
    label: <>campus status · {keep("UCPD")} · crime log</>,
    shots: [{ file: "safety", alt: "Campus status, UCPD contacts and a map of recent reports", w: 0.8 }],
  },
  {
    id: "widgets",
    q: "or skip the app entirely.",
    label: "widgets for parking, dining, events and more",
    home: true,
    shots: [
      { file: "widgets", alt: "Home Screen widgets for events, study rooms, parking and dining", w: 0.8, own: true },
      { file: "lock-widget", alt: "Dining widget on the Lock Screen", w: 0.6, own: true },
    ],
  },
];

const STEPS = CHAPTERS.flatMap((c, ci) => c.shots.map((s) => ({ ...s, ci })));
const STARTS = STEPS.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + STEPS[i - 1].w : 0], []);
const TOTAL = STARTS[STEPS.length - 1] + STEPS[STEPS.length - 1].w;
const at = (file: string) => STEPS.findIndex((s) => s.file === file);

// Annotations: shown while step `s` is between local progress `from` and `to`
const NOTES: { s: number; from: number; to: number; y: string; body: ReactNode }[] = [
  { s: at("dining"), from: 0.3, to: 0.9, y: "9%", body: <><strong>favorite dishes</strong> ping you when they’re served</> },
  { s: at("classes"), from: 0.06, to: 0.48, y: "52%", body: <>your whole week from {keep("R’Web")}, <strong>in under 30 seconds</strong></> },
  { s: at("classes"), from: 0.72, to: 0.95, y: "30%", body: <><strong>friends in class with you</strong> light up</> },
  { s: at("src"), from: 0.55, to: 0.9, y: "74%", body: <><strong>your {keep("SRC")} pass</strong>, without signing in to {keep("UCR")} every visit</> },
  { s: at("lock-widget"), from: 0.15, to: 2, y: "62%", body: <>on the <strong>Lock Screen</strong> too</> },
];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => 1 - (1 - t) ** 3;
const smooth = (t: number) => t * t * (3 - 2 * t);
const back = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
// Half the scroll, in step units, that a screen change takes
const H = 0.26;
const NOW = 320; // 1:20 PM, in minutes after 8a

function Arrow() {
  return (
    <svg viewBox="0 0 48 40" aria-hidden>
      <path d="M4 34c14 2 26-6 34-24" pathLength={1} />
      <path d="M30 12l8-3 3 8" pathLength={1} />
    </svg>
  );
}

// Placeholder barcode: deterministic bar widths, not anyone's real student ID.
const BARS: number[] = (() => {
  let s = 7;
  const out: number[] = [];
  for (let i = 0; i < 64; i++) {
    s = (s * 48271) % 2147483647;
    out.push(1 + (s % 3));
  }
  return out;
})();

function BarcodeCard() {
  let x = 0;
  const rects = BARS.map((w, i) => {
    const r = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={60} /> : null;
    x += w;
    return r;
  });
  return (
    <div className="pass-card lp-keep" aria-hidden>
      <div className="pass-head">
        <b>SRC Pass</b>
        <span>scotty001</span>
      </div>
      <div className="pass-body">
        <svg viewBox={`0 0 ${x} 60`} preserveAspectRatio="none">
          {rects}
        </svg>
      </div>
      <i className="pass-bar" />
    </div>
  );
}

function FavoriteNote() {
  return (
    <div className="ping-note lp-keep">
      <img src={`${base}/icon.png`} alt="" width={38} height={38} />
      <div>
        <p>
          <strong>Go to Glasgow for lunch</strong>
          <span>now</span>
        </p>
        <p>Butter Chicken is being served</p>
      </div>
    </div>
  );
}

export function Tour({ cta }: { cta: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const q = <T extends HTMLElement>(s: string) => [...el.querySelectorAll<T>(s)];
    const screens = q(".tv-scr");
    const copies = q(".tv-copy > div");
    const words = copies.map((c) => q<HTMLElement>(`#${c.id} .tv-w > span`));
    const labels = q(".tv-copy p:not(.tv-sr)");
    const items = q(".tv-index button");
    const mark = el.querySelector<HTMLElement>(".tv-mark")!;
    const notes = q(".tv-note");
    const cs = el.querySelector<HTMLElement>(".cs")!;
    const clock = cs.querySelector<HTMLElement>(".sb-time")!;
    const blocks = q(".cs-block");
    const over = el.querySelector<HTMLElement>(".tv-over")!;
    const pass = el.querySelector<HTMLElement>(".tv-pass")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let still = motion.matches;
    const ping = at("dining"), cls = at("classes"), gym = at("src");
    // classes fill in as a diagonal wave across the week
    const wave = BLOCKS.map(([day, mins]) => day + mins / 120);

    // Chapter index positions, measured on resize rather than every frame
    let spots: { x: number; y: number; w: number }[] = [];
    const measure = () => (spots = items.map((b) => ({ x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth })));

    // Word-by-word roll through a line mask: v < 0 has left upward, v > 0 waits below
    const roll = (ws: HTMLElement[], v: number) =>
      ws.forEach((w, i) => {
        const k = smooth(clamp(Math.abs(v) * (1 + 0.1 * (ws.length - 1)) - (v < 0 ? i : ws.length - 1 - i) * 0.1));
        w.style.transform = `translateY(${Math.sign(v) * k * 115}%) skewY(${Math.sign(v) * Math.sin(Math.PI * k) * 4}deg)`;
      });

    let target = 0, t = -1, raf = 0;
    const frame = () => {
      raf = 0;
      // Ease toward the scroll position so wheel notches glide instead of jump
      t = still || t < 0 ? target : t + (target - t) * 0.16;
      if (Math.abs(target - t) < 0.0005) t = target;
      else raf = requestAnimationFrame(frame);
      draw();
    };
    const read = () => {
      const span = el.offsetHeight - innerHeight;
      target = clamp((scrollY - (el.getBoundingClientRect().top + scrollY)) / span) * TOTAL;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const draw = () => {
      const cur = STARTS.findLastIndex((s) => s <= t);
      const local = (i: number) => clamp((t - STARTS[i]) / STEPS[i].w);

      // Screen change around the nearest boundary, if we are within H of it
      const k = STARTS.findIndex((s, i) => i > 0 && Math.abs(t - s) < H);
      const u = k > 0 ? smooth(clamp((t - STARTS[k] + H) / (2 * H))) : 0;
      const from = k > 0 ? k - 1 : cur;
      const to = k > 0 ? k : cur;
      const kind = k <= 0 ? "" : STEPS[k].ci === STEPS[k - 1].ci ? "push" : CHAPTERS[STEPS[k].ci].home ? "home" : "deck";

      screens.forEach((s, i) => {
        const st = s.style;
        const on = i === from || i === to;
        st.visibility = on ? "visible" : "hidden";
        st.willChange = on && kind ? "transform" : "auto";
        if (!on) return;
        const out = i === from && k > 0;
        const p = out ? u : 1 - u;
        st.zIndex = i === to ? "2" : "1";
        st.opacity = "1";
        st.borderRadius = "";
        st.setProperty("--dim", "0");
        if (!kind) st.transform = "none";
        else if (still) {
          // reduced motion: a clean cut halfway, no double exposure
          st.transform = "none";
          st.opacity = (out ? u < 0.5 : u >= 0.5) ? "1" : "0";
        } else if (kind === "push") {
          st.transform = out ? `translateX(${-30 * u}%)` : `translateX(${100 * p}%)`;
          if (out) st.setProperty("--dim", String(u * 0.18));
        } else if (kind === "deck") {
          // app switcher: cards shrink, slide with a 4% gap, lift slightly, settle
          const bump = smooth(clamp(u / 0.3)) * smooth(clamp((1 - u) / 0.3));
          const sc = 1 - 0.1 * bump;
          st.transform = `translate(${(out ? -1 : 1) * (sc * 100 + 4) * p}%, ${-2 * bump}%) scale(${sc})`;
        } else if (out) {
          // app closes into the Rivera widget on the Home Screen
          const e = ease(u), sc = 1 - 0.74 * e;
          st.transform = `translate(${-27 * e}%, ${-8 * e}%) scale(${sc})`;
          st.borderRadius = `${Math.min(13 / sc, 30)}cqw`;
          st.opacity = String(1 - clamp((u - 0.6) / 0.4));
        } else {
          st.transform = `scale(${1.1 - 0.1 * ease(u)})`;
          st.zIndex = "0";
        }
      });

      // Questions: the old one clears quickly and the new one rolls in, overlapping a little
      const ca = STEPS[from].ci, cb = STEPS[to].ci;
      const half = still ? (u < 0.5 ? 0 : 1) : u;
      copies.forEach((_, i) => {
        const v =
          ca === cb ? (i === ca ? 0 : 1)
          : i === ca ? (still ? -half : -clamp(u / 0.45))
          : i === cb ? (still ? 1 - half : 1 - clamp((u - 0.3) / 0.7))
          : 1;
        labels[i].style.opacity = String(clamp(1 - Math.abs(v) * 3));
        roll(words[i], still ? Math.sign(v) * Math.ceil(Math.abs(v)) : v);
      });

      // Index marker glides continuously between chapter names
      const f = ca + (ca === cb ? 0 : u);
      const a = spots[Math.floor(f)], b = spots[Math.min(spots.length - 1, Math.floor(f) + 1)];
      const r = f - Math.floor(f);
      mark.style.setProperty("--x", `${a.x + (b.x - a.x) * r}px`);
      mark.style.setProperty("--y", `${a.y + (b.y - a.y) * r}px`);
      mark.style.setProperty("--w", String(a.w + (b.w - a.w) * r));
      items.forEach((it, i) => (i === Math.round(f) ? it.setAttribute("aria-current", "step") : it.removeAttribute("aria-current")));

      // Favorite dish banner drops in on the first dining screen
      if (from === ping || to === ping)
        screens[ping].style.setProperty("--ping", String(still ? 1 : ease(clamp((local(ping) - 0.06) / 0.3))));

      // Classes: the week fills in, then "now" sweeps to 1:20 and lights up friends in CS 010B
      if (from === cls || to === cls) {
        const pc = local(cls);
        blocks.forEach((bl, j) => {
          const e = still ? 1 : clamp((pc - 0.04 - wave[j] * 0.04) / 0.18);
          bl.style.opacity = String(clamp(e * 4));
          bl.style.transform = `translateY(${(1 - back(e)) * -70}%) scale(${0.8 + 0.2 * back(e)})`;
        });
        const mins = Math.round(still ? NOW : ease(clamp((pc - 0.5) / 0.26)) * NOW);
        const ring = clamp((mins - 300) / 10);
        cs.style.setProperty("--now", String(mins));
        cs.style.setProperty("--live", String(still ? 1 : clamp(pc * 14 - 7)));
        cs.style.setProperty("--ring", String(ring));
        cs.style.setProperty("--ring-b", String(back(ring)));
        clock.textContent = `${((7 + Math.floor(mins / 60)) % 12) + 1}:${String(mins % 60).padStart(2, "0")}`;
      }

      // The SRC pass peels off the gym screen; its layer rides along when the screen moves
      const gymOn = from === gym || to === gym;
      over.style.visibility = gymOn ? "visible" : "hidden";
      if (gymOn) {
        const lift = String(still ? 1 : ease(clamp((local(gym) - 0.12) / 0.45)));
        pass.style.setProperty("--l", lift);
        screens[gym].style.setProperty("--l", lift);
        over.style.transform = screens[gym].style.transform;
        over.style.opacity = screens[gym].style.opacity;
      }

      notes.forEach((n, i) => {
        const { s, from: a0, to: a1 } = NOTES[i];
        const p = (t - STARTS[s]) / STEPS[s].w;
        const o = clamp(Math.min((p - a0) / 0.1, (a1 - p) / 0.06));
        n.style.visibility = o > 0 ? "visible" : "hidden";
        n.style.setProperty("--o", String(o));
      });
    };

    const onResize = () => {
      measure();
      read();
    };
    const onMotion = () => {
      still = motion.matches;
      read();
    };
    measure();
    read();
    addEventListener("scroll", read, { passive: true });
    addEventListener("resize", onResize);
    motion.addEventListener("change", onMotion);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", read);
      removeEventListener("resize", onResize);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  const jump = (ci: number) => {
    const el = root.current!;
    const s = STARTS[STEPS.findIndex((x) => x.ci === ci)] + (ci ? H : 0);
    const top = el.getBoundingClientRect().top + scrollY;
    const y = top + (s / TOTAL) * (el.offsetHeight - innerHeight) + 2;
    // gliding through every chapter in between looks like a glitch, so long jumps cut
    const near = Math.abs(y - scrollY) < innerHeight * 0.8;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: y, behavior: near && !still ? "smooth" : "instant" });
  };

  return (
    <section className="tv" ref={root} style={{ "--t": TOTAL } as CSSProperties} aria-label="Belltower, feature by feature">
      <div className="tv-stage">
        <div className="tv-side">
          <nav className="tv-index" aria-label="Features">
            {CHAPTERS.map((c, i) => (
              <button key={c.id} type="button" onClick={() => jump(i)}>
                {c.id}
              </button>
            ))}
            <i className="tv-mark" aria-hidden />
          </nav>
          <div className="tv-copy">
            {CHAPTERS.map((c) => (
              <div key={c.id} id={`tv-${c.id}`}>
                <h2>
                  {c.q.split(" ").map((w, i) => (
                    <Fragment key={i}>
                      <span className="tv-w">
                        <span>{w}</span>
                      </span>{" "}
                    </Fragment>
                  ))}
                </h2>
                <p>{c.label}</p>
                <p className="tv-sr">{c.shots.map((s) => s.alt).join(". ")}.</p>
              </div>
            ))}
          </div>
          <div className="tv-cta">{cta}</div>
        </div>

        <div className="tv-device" aria-hidden>
          <div className="tv-body">
            <div className="tv-screen">
              {STEPS.map((s) => (
                <div key={s.file} className="tv-scr">
                  {s.file === "classes" ? (
                    <ClassesScreen />
                  ) : (
                    <img src={`${base}/screens/${s.file}.jpg`} alt="" width={602} height={1308} decoding="async" />
                  )}
                  {!s.own && s.file !== "classes" && <StatusBar />}
                  {s.file === "dining" && <FavoriteNote />}
                  {s.file === "src" && <i className="tv-slot" />}
                </div>
              ))}
              <span className="tv-island" />
            </div>
          </div>
          <div className="tv-over">
            <div className="tv-pass">
              <BarcodeCard />
            </div>
          </div>
          {NOTES.map((n, i) => (
            <p key={i} className="tv-note" style={{ "--y": n.y } as CSSProperties}>
              <Arrow />
              <span>{n.body}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
