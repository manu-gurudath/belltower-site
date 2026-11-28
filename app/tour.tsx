"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { BLOCKS, ClassesScreen } from "./classes-screen";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Shot = { file: string; alt: string; w: number };
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
      { file: "dining", alt: "Glasgow dinner menu by station", w: 1 },
      { file: "nutrition", alt: "Nutrition facts for a dish", w: 0.6 },
    ],
  },
  {
    id: "classes",
    q: "who’s in class with you?",
    label: <>import from {keep("R’Web")} · friends · seats · ratings</>,
    shots: [
      { file: "classes", alt: "", w: 1.7 },
      { file: "course", alt: "A class with open seats, description and restrictions", w: 0.6 },
      { file: "professor", alt: "Professor ratings and student reviews", w: 0.6 },
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
    shots: [{ file: "src", alt: "Live SRC headcounts by area", w: 1.1 }],
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
    shots: [
      { file: "safety", alt: "Campus status and UCPD contacts", w: 0.7 },
      { file: "crime-log", alt: "Map and log of recent reports", w: 0.6 },
    ],
  },
  {
    id: "widgets",
    q: "or skip the app entirely.",
    label: "widgets for parking, dining, events and more",
    home: true,
    shots: [
      { file: "widgets", alt: "Home Screen widgets for events, study rooms, parking and dining", w: 0.8 },
      { file: "lock-widget", alt: "Dining widget on the Lock Screen", w: 0.6 },
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
  { s: at("classes"), from: 0.06, to: 0.4, y: "52%", body: <>your whole week from {keep("R’Web")}, <strong>in under 30 seconds</strong></> },
  { s: at("classes"), from: 0.62, to: 0.9, y: "30%", body: <><strong>friends in class with you</strong> light up</> },
  { s: at("src"), from: 0.55, to: 0.9, y: "56%", body: <><strong>your {keep("SRC")} pass</strong>, without signing in to {keep("UCR")} every visit</> },
  { s: at("lock-widget"), from: 0.15, to: 2, y: "62%", body: <>on the <strong>Lock Screen</strong> too</> },
];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => 1 - (1 - t) ** 3;
const smooth = (t: number) => t * t * (3 - 2 * t);
const back = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
// Half the scroll, in step units, that a screen change takes
const H = 0.17;
const NOW = 320; // 1:20 PM, in minutes after 8a

function Arrow() {
  return (
    <svg viewBox="0 0 48 40" aria-hidden>
      <path d="M4 34c14 2 26-6 34-24" />
      <path d="M30 12l8-3 3 8" />
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
    <div className="ping-note lp-keep" aria-label="Belltower notification: Butter Chicken is being served at Glasgow">
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

export function Tour() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const q = <T extends HTMLElement>(s: string) => [...el.querySelectorAll<T>(s)];
    const screens = q(".tv-scr");
    const copies = q(".tv-copy > div");
    const words = copies.map((c) => q<HTMLElement>(`#${c.id} .tv-w > span`));
    const labels = q(".tv-copy p");
    const items = q(".tv-index button");
    const mark = el.querySelector<HTMLElement>(".tv-mark")!;
    const notes = q(".tv-note");
    const cs = el.querySelector<HTMLElement>(".cs")!;
    const blocks = q(".cs-block");
    const pass = el.querySelector<HTMLElement>(".tv-pass")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ping = at("dining"), cls = at("classes"), gym = at("src");

    // Word-by-word roll through a line mask: v < 0 has left upward, v > 0 waits below
    const roll = (ws: HTMLElement[], v: number) =>
      ws.forEach((w, i) => {
        const k = clamp((Math.abs(v) * (1 + 0.1 * (ws.length - 1)) - (v < 0 ? i : ws.length - 1 - i) * 0.1));
        w.style.transform = `translateY(${Math.sign(v) * smooth(k) * 115}%)`;
      });

    let raf = 0;
    const update = () => {
      raf = 0;
      const span = el.offsetHeight - innerHeight;
      const t = clamp((scrollY - (el.getBoundingClientRect().top + scrollY)) / span) * TOTAL;
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
        st.visibility = i === from || i === to ? "visible" : "hidden";
        st.zIndex = i === to ? "2" : "1";
        st.setProperty("--dim", "0");
        st.opacity = "1";
        if (i !== from && i !== to) return;
        const out = i === from && k > 0;
        const p = out ? u : 1 - u;
        if (!kind) st.transform = "none";
        else if (still) {
          st.transform = "none";
          st.opacity = String(out ? 1 - u : u);
        } else if (kind === "push") {
          st.transform = out ? `translateX(${-30 * u}%)` : `translateX(${100 * p}%)`;
          if (out) st.setProperty("--dim", String(u * 0.25));
        } else if (kind === "deck") {
          const sc = 1 - 0.14 * Math.sin(Math.PI * u);
          st.transform = `translateX(${(out ? -108 : 108) * p}%) scale(${sc})`;
        } else if (out) {
          st.transform = `translateY(${18 * ease(u)}%) scale(${1 - 0.86 * ease(u)})`;
          st.opacity = String(1 - clamp((u - 0.55) / 0.45));
        } else {
          st.transform = `scale(${1.14 - 0.14 * ease(u)})`;
          st.zIndex = "0";
        }
      });

      // Questions roll word by word when the chapter changes
      const ca = STEPS[from].ci, cb = STEPS[to].ci;
      copies.forEach((c, i) => {
        // the old question clears in the first 60% of the change, the new one rolls in over the last 60%
        const v = ca === cb ? (i === ca ? 0 : 1) : i === ca ? -clamp(u / 0.6) : i === cb ? 1 - clamp((u - 0.4) / 0.6) : 1;
        c.style.visibility = v === 1 || v === -1 ? "hidden" : "visible";
        labels[i].style.opacity = String(clamp(1 - Math.abs(v) * 2.5));
        if (still) {
          c.style.opacity = String(1 - Math.abs(v));
          roll(words[i], 0);
        } else roll(words[i], v);
      });

      // Index marker glides continuously between chapter names
      const f = ca + (ca === cb ? 0 : u);
      const a = items[Math.floor(f)], b = items[Math.min(items.length - 1, Math.floor(f) + 1)];
      const r = f - Math.floor(f);
      mark.style.transform = `translate(${a.offsetLeft + (b.offsetLeft - a.offsetLeft) * r}px, ${a.offsetTop + (b.offsetTop - a.offsetTop) * r}px)`;
      mark.style.width = `${a.offsetWidth + (b.offsetWidth - a.offsetWidth) * r}px`;
      items.forEach((it, i) => it.toggleAttribute("aria-current", i === Math.round(f)));

      // Favorite dish banner drops in on the first dining screen
      screens[ping].style.setProperty("--ping", String(still ? 1 : ease(clamp((local(ping) - 0.06) / 0.3))));

      // Classes: the week fills in, then "now" sweeps to 1:20 and lights up friends in CS 010B
      const pc = local(cls);
      blocks.forEach((b, j) => {
        const e = still ? 1 : clamp((pc - 0.05 - j * 0.035) / 0.14);
        b.style.opacity = String(clamp(e * 3));
        b.style.transform = `translateY(${(1 - back(e)) * -26}%) scale(${0.86 + 0.14 * back(e)})`;
      });
      const mins = still ? NOW : ease(clamp((pc - 0.42) / 0.26)) * NOW;
      cs.style.setProperty("--now", String(mins));
      cs.style.setProperty("--live", String(clamp(pc * 12 - 5)));
      cs.style.setProperty("--ring", String(clamp((mins - 292) / 22)));

      // The SRC pass peels off the gym screen
      const lift = String(still ? 1 : ease(clamp((local(gym) - 0.12) / 0.45)));
      pass.style.setProperty("--l", lift);
      screens[gym].style.setProperty("--l", lift);
      pass.style.visibility = from === gym || to === gym ? "visible" : "hidden";
      pass.style.opacity = String(k === gym ? u ** 4 : from === gym && k > 0 ? clamp(1 - u * 2.5) : 1);

      notes.forEach((n, i) => {
        const { s, from: a0, to: a1 } = NOTES[i];
        const p = (t - STARTS[s]) / STEPS[s].w;
        const o = clamp(Math.min((p - a0) / 0.08, (a1 - p) / 0.08));
        n.style.opacity = String(o);
        n.style.setProperty("--o", String(o));
      });
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

  const jump = (ci: number) => {
    const el = root.current!;
    const s = STARTS[STEPS.findIndex((x) => x.ci === ci)] + (ci ? H : 0);
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (s / TOTAL) * (el.offsetHeight - innerHeight) + 2, behavior: "smooth" });
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
              </div>
            ))}
          </div>
        </div>

        <div className="tv-device">
          <div className="tv-body">
            <div className="tv-screen">
            {STEPS.map((s) => (
              <div key={s.file} className="tv-scr">
                {s.file === "classes" ? (
                  <ClassesScreen />
                ) : (
                  <img src={`${base}/screens/${s.file}.jpg`} alt={s.alt} width={602} height={1308} loading="lazy" decoding="async" />
                )}
                {s.file === "dining" && <FavoriteNote />}
                {s.file === "src" && <i className="tv-slot" aria-hidden />}
              </div>
            ))}
            <span className="tv-island" aria-hidden />
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
