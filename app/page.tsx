import './home.css';

import { HeroPhoto } from './hero-photo';
import { PingScroll } from './ping-scroll';
import type { CSSProperties, ReactNode } from 'react';


const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const APP_STORE_URL = 'https://apps.apple.com/us/app/belltower-for-ucr/id6837758300';

function AppStoreButton() {
  return (
    <a className="store" href={APP_STORE_URL} aria-label="Download Belltower on the App Store">
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M15.53 3.83c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.67.8-3.54 1.82-.78.9-1.45 2.34-1.27 3.71 1.34.1 2.72-.69 3.56-1.7zM12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.46 2.2 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.5 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.15-3.68 1.09-4.62 1.09z" />
      </svg>
      <span>
        <small>Download on the</small>
        App Store
      </span>
    </a>
  );
}

// Hero feature chips: [label, 24x24 stroke icon path]
const CHIPS: [string, string][] = [
  ['dining menus', 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 7h3'],
  ['class countdowns', 'M12 8v5l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM10 2h4'],
  ['book study rooms', 'M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5'],
  ['live SRC crowds', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6'],
  ['campus events', 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4'],
  ['600+ clubs', 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9z'],
];

type Group = { name: ReactNode; note: ReactNode; shots: [string, string][]; ping?: boolean; lead?: ReactNode };

const keep = (t: string) => <span className="lp-keep">{t}</span>;

// Each group spans one grid column per screenshot (the import card counts as one).
// With dense flow, this order fills every row at 6 columns (desktop), 4 (tablet) and 2 (phone).
const GROUPS: Group[] = [
  {
    name: 'dining',
    note: 'all four halls, nutrition, diet filters',
    ping: true,
    shots: [
      ['dining', 'Glasgow dinner menu by station'],
      ['nutrition', 'Nutrition facts for a dish'],
      ['filters', 'Diet and allergen filters'],
    ],
  },
  { name: 'study rooms', note: <>Rivera & Orbach, 7 days out</>, shots: [['library', 'Study room availability at Rivera']] },
  {
    name: 'events',
    note: 'everything on campus',
    shots: [
      ['events', 'Campus events list'],
      ['event', 'An event with calendar, share and tickets'],
    ],
  },
  {
    name: 'classes',
    note: <>import from {keep("R'Web")}, seats, prereqs, professor ratings</>,
    lead: <ImportCard />,
    shots: [
      ['course', 'A class with open seats, description and restrictions'],
      ['prereqs', 'Prerequisites and lecture sections'],
      ['professor', 'Professor ratings and student reviews'],
    ],
  },
  {
    name: 'clubs',
    note: '600+ clubs',
    shots: [
      ['clubs', 'Clubs directory with saved clubs'],
      ['club', 'A club profile'],
    ],
  },
  {
    name: 'widgets',
    note: 'parking, dining, events and more',
    shots: [
      ['widgets', 'Home Screen widgets for events, study rooms, parking and dining'],
      ['widgets-2', 'Safety and SRC widgets'],
      ['lock-widget', 'Dining widget on the Lock Screen'],
    ],
  },
  { name: keep('SRC'), note: 'live headcounts', shots: [['src', 'Live SRC headcounts by area']] },
  {
    name: 'safety',
    note: <>campus status, {keep('UCPD')}, crime log</>,
    shots: [
      ['safety', 'Campus status and UCPD contacts'],
      ['crime-log', 'Map and log of recent reports'],
    ],
  },
];

// Favorite-dish alert, laid over the first dining screen.
function FavoriteNote() {
  return (
    <div className="pv-note ping-note lp-keep" aria-label="Belltower notification: Butter Chicken is being served at Glasgow">
      <img className="pv-app" src={`${base}/icon.png`} alt="" width={38} height={38} />
      <div>
        <div className="pv-row">
          <small className="ping-ts">Time Sensitive</small>
          <span className="pv-dim">now</span>
        </div>
        <strong>Go to Glasgow for lunch</strong>
        <p>Butter Chicken is being served</p>
      </div>
    </div>
  );
}

function PingTag() {
  return (
    <span className="ping-tag">
      <svg viewBox="0 0 48 40" aria-hidden>
        <path d="M4 34c14 2 26-6 34-24" />
        <path d="M30 12l8-3 3 8" />
      </svg>
      <span>
        <strong>favorite dishes</strong> ping you when they&rsquo;re served
      </span>
    </span>
  );
}

function ImportCard() {
  return (
    <div className="imp">
      <div className="imp-time">
        <small>import all your classes in under 30 seconds</small>
      </div>
      <ol className="imp-steps lp-keep">
        <li>
          <span className="imp-btn">Import</span>
        </li>
        <li>
          <span className="imp-sso">Sign in to UCR</span>
        </li>
        <li>
          <span className="imp-week" aria-label="Your week, filled in">
            <i style={{ gridArea: '1 / 1 / 3 / 2' }} />
            <i style={{ gridArea: '2 / 3 / 4 / 4' }} />
            <i style={{ gridArea: '1 / 2 / 2 / 3' }} />
            <i style={{ gridArea: '3 / 2 / 5 / 3' }} />
            <i style={{ gridArea: '1 / 4 / 3 / 5' }} />
            <i style={{ gridArea: '3 / 5 / 4 / 6' }} />
          </span>
        </li>
      </ol>
    </div>
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
    <div className="pass-card lp-keep" aria-label="SRC barcode in Belltower">
      <div className="pass-head">
        <b>Barcode</b>
        <span>scotty001</span>
      </div>
      <div className="pass-body">
        <svg viewBox={`0 0 ${x} 60`} preserveAspectRatio="none" aria-hidden>
          {rects}
        </svg>
        <span className="pass-num">120 4417 3062 85</span>
      </div>
      <i className="pass-bar" aria-hidden />
    </div>
  );
}

function SrcPass() {
  return (
    <section className="lp-pass" aria-labelledby="pass">
      <div className="pass-copy">
        <h3 id="pass">
          <span style={{ fontWeight: 300 }}>hate how the {keep('UCRSRC')} app makes you sign every time?</span> belltower lets you get in with just a tap.
        </h3>
        <div className="pass-compare">
          <div className="pass-old">
            <small>the usual way, every single visit</small>
            <ol>
              <li>open the portal</li>
              <li>sign in to {keep('UCR')}</li>
              <li>type your NetID and password</li>
              <li>find the barcode</li>
            </ol>
          </div>
          <div className="pass-new">
            <small>with Belltower</small>
            <ol>
              <li>open Belltower</li>
              <li>scan in</li>
            </ol>
          </div>
        </div>
      </div>
      <BarcodeCard />
    </section>
  );
}

export default function Home() {
  return (
    <div className="lp">
      <header className="lp-top">
        <a className="lp-brand" href={`${base}/`}>
          <img src={`${base}/icon.png`} alt="" />
          Belltower
        </a>
        <a className="lp-link" href={`${base}/privacy-policy/`}>
          Privacy
        </a>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-copy">
          <h1>
            the free ucr app for everything on campus
          </h1>
          <ul className="lp-chips" aria-label="Features">
            {CHIPS.map(([label, d]) => (
              <li key={label}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={d} />
                </svg>
                {label}
              </li>
            ))}
          </ul>
          <div className="lp-ctas">
            <AppStoreButton />
            <a className="award" href="https://acm-dev.cs.ucr.edu/hacks/cutiehack" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
              </svg>
              <span>
                <small>placed</small>
                <b>
                  #2 in <span className="lp-keep">UCR&apos;s</span> <span className="lp-keep">CutieHack</span> 2026
                </b>
              </span>
            </a>
          </div>
        </div>
        <HeroPhoto />
      </section>

      <section className="lp-shots" aria-label="Screenshots">
        <PingScroll />
        {GROUPS.map((g) => (
            <figure
              key={g.shots[0][0]}
              className={`lp-group lp-g-${g.shots[0][0]}`}
              style={{ '--n': g.shots.length + (g.lead ? 1 : 0) } as CSSProperties}
            >
              <figcaption>
                <b>{g.name}</b>
                <span>{g.note}</span>
              </figcaption>
              <div className="lp-group-row">
                {g.lead}
                {g.shots.map(([file, alt], i) => {
                  const img = (
                    <img
                      key={file}
                      className="lp-shot"
                      src={`${base}/screens/${file}.jpg`}
                      alt={alt}
                      width={602}
                      height={1308}
                      loading="lazy"
                      decoding="async"
                    />
                  );
                  return g.ping && i === 0 ? (
                    <div key={file} className="ping-shot">
                      {img}
                      <div className="ping-layer">
                        <div className="ping-drop">
                          <FavoriteNote />
                          <PingTag />
                        </div>
                      </div>
                    </div>
                  ) : (
                    img
                  );
                })}
              </div>
            </figure>
        ))}
      </section>

      <SrcPass />

      <section className="lp-siri">
        <blockquote>&ldquo;What&rsquo;s for dinner at Glasgow in Belltower?&rdquo;</blockquote>
        <p>Ten Siri shortcuts work without setup, from your next class to where to park.</p>
      </section>

      <section className="lp-end" aria-labelledby="price">
        <div className="lp-end-main">
          <img className="lp-end-icon" src={`${base}/icon.png`} alt="" width={84} height={84} />
          <h2 id="price">
            free.
            <br />
            <span>for every Highlander.</span>
          </h2>
          <div className="lp-end-cta">
            <AppStoreButton />
            <span>
              no account or subscription
            </span>
          </div>
        </div>
        <div className="lp-saves">
          <small>no more</small>
          <ul>
            <li><s>circling full lots before class</s></li>
            <li><s>missing your favorite dish at the other hall</s></li>
            <li><s>showing up to a packed gym</s></li>
            <li><s>signing in to {keep('UCR')} just to get into the gym</s></li>
          </ul>
        </div>
      </section>

      <footer className="lp-foot">
        <span>Unofficial. Not affiliated with UC Riverside.</span>
        <a href={`${base}/privacy-policy/`}>Privacy Policy</a>
      </footer>
    </div>
  );
}
