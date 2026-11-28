import './home.css';

import { HeroPhoto } from './hero-photo';
import { Tour } from './tour';


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
  ['friends\' schedules', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6'],
  ['class countdowns', 'M12 8v5l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM10 2h4'],
  ['book study rooms', 'M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5'],
  ['live SRC crowds', 'M4 9v6M8 6v12M16 6v12M20 9v6M8 12h8'],
  ['events & 600+ clubs', 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4'],
];

const keep = (t: string) => <span className="lp-keep">{t}</span>;

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
              <i aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
                </svg>
              </i>
              <span>
                <b>
                  #2 at <span className="lp-keep">CutieHack</span>
                </b>
                <small>
                  <span className="lp-keep">UCR&apos;s</span> hackathon, 2026
                </small>
              </span>
            </a>
          </div>
        </div>
        <HeroPhoto />
      </section>

      <Tour />

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
