import './home.css';

import type { CSSProperties, ReactNode } from 'react';

import { LockScreen } from './previews';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const APP_STORE_URL = 'javascript:void(0)';

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

type Group = { name: ReactNode; note: ReactNode; shots: [string, string][] };

const keep = (t: string) => <span className="lp-keep">{t}</span>;

// Each group spans one grid column per screenshot (the import card counts as one).
const GROUPS: (Group | 'import')[] = [
  {
    name: 'dining',
    note: 'all four halls, nutrition, diet filters',
    shots: [
      ['dining', 'Glasgow dinner menu by station'],
      ['nutrition', 'Nutrition facts for a dish'],
      ['filters', 'Diet and allergen filters'],
    ],
  },
  'import',
  { name: 'study rooms', note: <>Rivera & Orbach, 7 days out</>, shots: [['library', 'Study room availability at Rivera']] },
  { name: keep('SRC'), note: 'live headcounts', shots: [['src', 'Live SRC headcounts by area']] },
  {
    name: 'events',
    note: 'everything on campus',
    shots: [
      ['events', 'Campus events list'],
      ['event', 'An event with calendar, share and tickets'],
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
    name: 'safety',
    note: <>campus status, {keep('UCPD')}, crime log</>,
    shots: [
      ['safety', 'Campus status and UCPD contacts'],
      ['crime-log', 'Map and log of recent reports'],
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
];

function ImportCard() {
  return (
    <figure className="lp-group lp-import">
      <figcaption>
        <b>classes</b>
        <span>import from {keep("R'Web")}</span>
      </figcaption>
      <div className="imp">
        <div className="imp-time">
          0:30
          <small>under 30 seconds, start to finish</small>
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
    </figure>
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
            <span className="lp-h1-lead">The UCR app for </span>
            <span className="lp-aurora">
              dining, classes, parking, study rooms, the <span className="lp-keep">SRC</span>, events, clubs, navigation, and
              safety
            </span>
          </h1>
          <AppStoreButton />
        </div>
        <div className="lp-hero-device">
          <LockScreen />
        </div>
      </section>

      <section className="lp-shots" aria-label="Screenshots">
        {GROUPS.map((g) =>
          g === 'import' ? (
            <ImportCard key="import" />
          ) : (
            <figure key={g.shots[0][0]} className="lp-group" style={{ '--n': g.shots.length } as CSSProperties}>
              <figcaption>
                <b>{g.name}</b>
                <span>{g.note}</span>
              </figcaption>
              <div className="lp-group-row">
                {g.shots.map(([file, alt]) => (
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
                ))}
              </div>
            </figure>
          ),
        )}
      </section>

      <section className="lp-siri">
        <blockquote>&ldquo;What&rsquo;s for dinner at Glasgow in Belltower?&rdquo;</blockquote>
        <p>Ten Siri shortcuts work without setup, from your next class to where to park.</p>
      </section>

      <section className="lp-end">
        <p className="lp-end-line">
          <img src={`${base}/tower.png`} alt="" />
          Belltower, for iPhone.
        </p>
        <AppStoreButton />
      </section>

      <footer className="lp-foot">
        <span>Unofficial. Not affiliated with UC Riverside.</span>
        <a href={`${base}/privacy-policy/`}>Privacy Policy</a>
      </footer>
    </div>
  );
}
