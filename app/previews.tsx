// Static recreations of Belltower's widgets, Live Activity and notifications, using real campus data.

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function LockScreen() {
  return (
    <div className="pv-phone" aria-label="Belltower class Live Activity on the iPhone Lock Screen">
      <span className="pv-key pv-key-action" aria-hidden />
      <span className="pv-key pv-key-volup" aria-hidden />
      <span className="pv-key pv-key-voldown" aria-hidden />
      <span className="pv-key pv-key-power" aria-hidden />
      <div className="pv-bezel">
        <div className="pv-screen">
          <span className="pv-island" aria-hidden />
          <div className="pv-status" aria-hidden>
            <span>AT&amp;T</span>
            <span className="pv-status-r">
              <svg viewBox="0 0 18 12" width="18" height="12">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                <rect x="10" y="3" width="3" height="9" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg viewBox="0 0 16 12" width="16" height="12">
                <path d="M8 11.6 5.6 9.2a3.4 3.4 0 0 1 4.8 0L8 11.6Zm-4.2-4.2-1.5-1.5a8.1 8.1 0 0 1 11.4 0l-1.5 1.5a6 6 0 0 0-8.4 0ZM.4 4 0 3.6l-1-1A12.8 12.8 0 0 1 17 2.6L15.6 4A10.8 10.8 0 0 0 .4 4Z" transform="translate(0 .2)" />
              </svg>
              <span className="pv-batt"><i /></span>
            </span>
          </div>
          <svg className="pv-padlock" viewBox="0 0 12 16" width="12" height="16" aria-hidden>
            <path d="M3 7V4.5a3 3 0 0 1 6 0V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <rect x="0.5" y="7" width="11" height="8.5" rx="2" />
          </svg>
          <div className="pv-lock">
            <p className="pv-lock-date">Tuesday, November 24</p>
            <p className="pv-lock-time">3:01</p>
            <img
              className="pv-la-shot"
              src={`${base}/live-activity.png`}
              width={610}
              height={244}
              alt="WRIT 010S, Lecture 007, Sproul Hall room 1102, starts in 58:28"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const LOTS: [string, number, number][] = [
  ['BS1', 338, 490],
  ['6', 347, 387],
  ['24', 317, 406],
  ['26', 390, 436],
  ['30', 1914, 2143],
  ['32', 258, 258],
  ['50', 365, 387],
];

export function ParkingWidgets() {
  return (
    <div className="pv-pair">
      <div className="pv-w pv-w-s" aria-label="Parking widget, small">
        <div className="pv-w-head">
          <span>Lot 30</span>
        </div>
        <div className="pv-big">
          1,914 <span className="pv-unit">open</span>
        </div>
        <div className="pv-meter">
          <i style={{ width: '89%' }} />
        </div>
        <div className="pv-cap">Try Lot 26 · 390</div>
        <div className="pv-cap pv-dim">7:51 AM</div>
      </div>
      <div className="pv-w pv-w-m" aria-label="Parking widget, medium">
        <div className="pv-w-head">
          <span>Parking</span>
          <span className="pv-dim">7:51 AM</span>
        </div>
        <div className="pv-bars">
          {LOTS.map(([name, free, total]) => (
            <div key={name} className={name === '30' ? 'pv-bar mine' : 'pv-bar'}>
              <span className="pv-bar-n">{free.toLocaleString('en-US')}</span>
              <span className="pv-bar-track">
                <i style={{ height: `${Math.max(4, (free / total) * 100)}%` }} />
              </span>
              <span className="pv-bar-l">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Island() {
  return (
    <div className="pv-stack pv-stack-center" aria-label="Class Live Activity in the Dynamic Island and on the Lock Screen">
      <div className="pv-caption">Dynamic Island</div>
      <div className="pv-pill">
        <span className="pv-pill-l">
          <span className="pv-ring" />
          CS 111
        </span>
        <span className="pv-count-s">31:40</span>
      </div>
      <div className="pv-caption">Live Activity</div>
      <div className="pv-isl pv-la">
        <div className="pv-row">
          <div>
            <div className="pv-code">CS 111</div>
            <div className="pv-sub">Lecture 001</div>
          </div>
          <div className="pv-right">
            <div className="pv-lbl">Left</div>
            <div className="pv-val">31:40</div>
          </div>
        </div>
        <div className="pv-meter pv-meter-gold">
          <i style={{ width: '37%' }} />
        </div>
        <div className="pv-row pv-cap pv-dim">
          <span>10:00 AM</span>
          <span>10:50 AM</span>
        </div>
      </div>
    </div>
  );
}

const DISHES: [string, string[], boolean][] = [
  ['Halal Grilled Chicken', [], true],
  ['Saffron Basmati Rice & Quinoa', ['vegan'], false],
  ['Roasted Eggplant', ['vegan', 'gluten-free'], false],
  ['Vegan Maple Pecan Cookie', ['vegan'], true],
];

export function Dining() {
  return (
    <div className="pv-stack">
      <div className="pv-note" aria-label="Belltower notification">
        <img className="pv-app" src={`${base}/icon.png`} alt="" width={38} height={38} />
        <div>
          <div className="pv-row">
            <strong>Go to Lothian for lunch</strong>
            <span className="pv-dim">now</span>
          </div>
          <p>
            Halal Grilled Chicken and Vegan Maple Pecan Cookie are being served. Glasgow also has one favorite dish:
            Menudo
          </p>
        </div>
      </div>
      <div className="pv-w pv-w-m pv-w-list" aria-label="Dining widget, medium">
        <div className="pv-w-head">
          <span>Lothian · Lunch</span>
          <span className="pv-open">Open till 2:30</span>
        </div>
        <ul>
          {DISHES.map(([name, diet, starred]) => (
            <li key={name}>
              <span>{name}</span>
              <span className="pv-tags">
                {diet.map((d) => (
                  <img key={d} src={`${base}/diet/${d}.png`} alt={d} width={14} height={14} />
                ))}
                {starred && <span className="pv-star">★</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Library() {
  return (
    <div className="pv-pair pv-pair-center">
      <div className="pv-circles" aria-label="Lock Screen widgets">
        <div className="pv-circle">
          <svg viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="15" />
            <circle cx="18" cy="18" r="15" className="on" strokeDasharray="47 95" />
          </svg>
          <span>6</span>
        </div>
        <div className="pv-circle">
          <svg viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="15" />
            <circle cx="18" cy="18" r="15" className="on" strokeDasharray="17 95" />
          </svg>
          <span>18%</span>
        </div>
      </div>
      <div className="pv-w pv-w-s" aria-label="Study rooms widget, small">
        <div className="pv-w-head">
          <span>Rivera</span>
        </div>
        <div className="pv-big">
          6 <span className="pv-unit">rooms free</span>
        </div>
        <div className="pv-cap">Rivera 209 free till 4:00 PM</div>
      </div>
    </div>
  );
}

const ZONES: [string, number][] = [
  ['Weight Room 1', 18],
  ['Weight Room 2', 23],
  ['Cardio', 31],
  ['Courts', 64],
];

export function Gym() {
  return (
    <div className="pv-w pv-w-m" aria-label="SRC widget, medium">
      <div className="pv-w-head">
        <span>SRC</span>
        <span className="pv-dim">5:28 PM</span>
      </div>
      <div className="pv-gym">
        <div>
          <div className="pv-big">Quiet</div>
          <div className="pv-cap">Weight rooms · 18%</div>
        </div>
        <ul>
          {ZONES.map(([zone, pct]) => (
            <li key={zone}>
              <span>{zone}</span>
              <span className="pv-meter">
                <i style={{ width: `${pct}%` }} />
              </span>
              <span className="pv-pct">{pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
