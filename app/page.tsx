import './home.css';

import { Dining, Gym, Island, Library, LockScreen, ParkingWidgets } from './previews';

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

const DAY = [
  {
    time: '7:52',
    meridiem: 'AM',
    title: 'Lot 30 still has room.',
    body: 'Open spaces for every lot, straight from UCR Transportation. Star the one you use and it sits on your Home Screen.',
    preview: <ParkingWidgets />,
  },
  {
    time: '10:18',
    meridiem: 'AM',
    title: 'Thirty-one minutes of lecture left.',
    body: 'Each saved class gets a Live Activity. It counts down to the start with walking directions, then counts down to the end.',
    preview: <Island />,
  },
  {
    time: '11:00',
    meridiem: 'AM',
    title: 'Lothian has your chicken.',
    body: 'Star dishes at Glasgow and Lothian. When a meal opens, Belltower tells you which hall is serving more of them.',
    preview: <Dining />,
  },
  {
    time: '2:15',
    meridiem: 'PM',
    title: 'A room at Rivera until four.',
    body: 'Seven days of study room openings at Rivera and Orbach. Pick a slot and finish the booking on LibCal.',
    preview: <Library />,
  },
  {
    time: '5:30',
    meridiem: 'PM',
    title: 'The SRC is quiet.',
    body: 'Live headcounts for the weight rooms, cardio floor and courts, so you can pick the quiet hour.',
    preview: <Gym />,
  },
];

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
            UCR parking, dining, classes, study rooms and gym. <span className="hl">One app.</span>
          </h1>
          <AppStoreButton />
        </div>
        <div className="lp-hero-device">
          <LockScreen />
        </div>
      </section>

      <section className="lp-day" aria-labelledby="day">
        <h2 id="day">One Tuesday on campus</h2>
        <ol>
          {DAY.map((entry) => (
            <li key={entry.time} className="lp-entry">
              <time>
                {entry.time}
                <span>{entry.meridiem}</span>
              </time>
              <div className="lp-entry-copy">
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
              </div>
              <div className="lp-entry-preview">{entry.preview}</div>
            </li>
          ))}
        </ol>
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
