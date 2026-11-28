// HTML rebuild of the Classes tab in iOS points (393 x 852), so tour.tsx can animate it.

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p'];

// [day, minutes after 8a, length in minutes, course, past week, dot, room]
export const BLOCKS: [number, number, number, string, boolean, boolean, string?][] = [
  [0, 120, 50, 'MATH 009C', true, true],
  [0, 300, 50, 'CS 010B', true, true],
  [1, 60, 50, 'MATH 009C', true, false],
  [2, 120, 50, 'MATH 009C', false, true],
  [2, 300, 50, 'CS 010B', false, true],
  [3, 0, 105, 'CS 010B', false, false, 'Lab 0204'],
  [4, 120, 50, 'MATH 009C', false, true],
  [4, 300, 50, 'CS 010B', false, true],
];

// [initials, name, color, status before, status once class starts]
const FRIENDS: [string, string, string, string, string][] = [
  ['LR', 'Leo', '#2a4fd6', 'Free', 'CS 010B'],
  ['MC', 'Maya', '#2a4fd6', 'Free', 'CS 010B'],
  ['SO', 'Sam', '#b64a22', 'Free', 'Free'],
  ['JK', 'Jordan', '#a85a24', 'Done', 'Done'],
];

const TABS: [string, string][] = [
  ['Today', 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4'],
  ['Dining', 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 7h3'],
  ['Gym', 'M14 4a2 2 0 1 0 0 .1M9 21l3-6 3 3v5M6 12l3-3 4 1 2 3 3 1M12 15l-1-5'],
  ['Classes', 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6'],
  ['More', 'M5 12h.01M12 12h.01M19 12h.01'],
];

// The iOS status bar, drawn once so every screen in the tour shows the same one
export function StatusBar({ time = '9:41' }: { time?: string }) {
  return (
    <div className="sb lp-keep">
      <b className="sb-time">{time}</b>
      <span>
        <svg viewBox="0 0 18 12" width="18" height="12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" width="16" height="12">
          <path d="M8 12 5.4 9.4a3.7 3.7 0 0 1 5.2 0L8 12Zm-4.1-4.1L2.3 6.3a8 8 0 0 1 11.4 0l-1.6 1.6a5.7 5.7 0 0 0-8.2 0ZM.7 4.7-.9 3.1a12.5 12.5 0 0 1 17.8 0l-1.6 1.6a10.2 10.2 0 0 0-14.6 0Z" />
        </svg>
        <i className="sb-batt" />
      </span>
    </div>
  );
}

export function ClassesScreen() {
  return (
    <div className="cs lp-keep">
      <StatusBar time="8:00" />
      <span className="cs-term">Fall 2026</span>
      <h4 className="cs-title">Classes</h4>
      <div className="cs-search">
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16 16l5 5" />
        </svg>
        CS 100, MATH 9A, or a title
      </div>
      <div className="cs-head" style={{ top: 'calc(226 * var(--pt))' }}>
        <b>Friends</b>
        <span>Settings</span>
      </div>
      <ul className="cs-friends">
        <li>
          <i className="cs-av" style={{ background: '#f3bc3c', color: '#14213d' }}>
            M<span className="cs-gear" />
          </i>
          <b>You</b>
          <span>Sharing</span>
        </li>
        {FRIENDS.map(([ini, name, bg, before, after]) => (
          <li key={ini} className={before === after ? undefined : 'cs-mate'}>
            <i className="cs-av" style={{ background: bg }}>
              {ini}
            </i>
            <b>{name}</b>
            <span className="cs-roll">
              <span>{before}</span>
              <span>{after}</span>
            </span>
          </li>
        ))}
        <li>
          <i className="cs-av" style={{ background: '#a8243d' }} />
        </li>
      </ul>
      <div className="cs-head" style={{ top: 'calc(392 * var(--pt))' }}>
        <b>Your Schedule</b>
        <span>Share</span>
      </div>
      <div className="cs-card">
        <span className="cs-today" />
        {DAYS.map((d, i) => (
          <span key={d} className={i === 2 ? 'cs-day on' : 'cs-day'} style={{ left: `calc(${58 + i * 61.6 - 16} * var(--pt))` }}>
            {d}
          </span>
        ))}
        {HOURS.map((h, i) => (
          <span key={h} className="cs-hour" style={{ top: `calc(${32 + i * 52.8} * var(--pt))` }}>
            {h}
          </span>
        ))}
        {BLOCKS.map(([day, at, len, code, past, dot, room]) => {
          const [dept, num] = code.split(' ');
          return (
            <span
              key={`${day}-${at}`}
              className={`cs-block ${code.startsWith('CS') ? 'cs-cs' : 'cs-math'}${past ? ' past' : ''}${dot ? ' dot' : ''}`}
              style={{
                left: `calc(${58 + day * 61.6 - 16} * var(--pt))`,
                top: `calc(${32 + (at / 60) * 52.8} * var(--pt))`,
                height: `calc(${(len / 60) * 52.8 - 3} * var(--pt))`,
              }}
            >
              <b>
                {dept}
                <br />
                {num}
              </b>
              {room && <small>{room}</small>}
            </span>
          );
        })}
        <span className="cs-now" />
      </div>
      <nav className="cs-tabs">
        {TABS.map(([label, d]) => (
          <span key={label} className={label === 'Classes' ? 'on' : undefined}>
            <svg viewBox="0 0 24 24">
              <path d={d} />
            </svg>
            {label}
          </span>
        ))}
      </nav>
    </div>
  );
}
