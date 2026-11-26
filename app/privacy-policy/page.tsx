import '../home.css';
import './privacy.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = { title: 'Privacy Policy · Belltower' };

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const EMAIL = 'hello@bymanu.me';

const SOURCES: [string, string][] = [
  ['Dining menus and nutrition', 'UCR Dining (FoodPro)'],
  ['Classes', 'UCR Banner and its status page'],
  ['Events', 'events.ucr.edu'],
  ['Clubs', 'HighlanderLink'],
  ['Parking', 'UCR Transportation open spaces'],
  ['Study rooms', 'UCR Library LibCal'],
  ['Campus map', 'UCR campus map (Concept3D) and Apple Maps'],
  ['Gym counts', 'UCR Recreation live counts'],
  ['Safety', 'UCR campus status and UCPD crime log'],
  ['Weather', 'Open-Meteo, for the campus location only'],
];

function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="pp-sec">
      <h2>
        {title}
        {note && <small>{note}</small>}
      </h2>
      <div className="pp-prose">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="lp">
      <header className="lp-top">
        <a className="lp-brand" href={`${base}/`}>
          <img src={`${base}/icon.png`} alt="" />
          Belltower
        </a>
        <a className="lp-link" href={`${base}/`}>
          Home
        </a>
      </header>

      <section className="pp-hero">
        <h1>
          <span className="lp-h1-lead">privacy policy. </span>
          what you save in belltower stays on your <span className="lp-keep">iPhone</span>.
        </h1>
        <div className="pp-meta">
          <span className="pp-chip pp-chip-gold">no account</span>
          <span className="pp-chip">anonymous analytics</span>
          <span className="pp-chip">no ad networks</span>
          <span className="pp-updated">last updated november 26, 2026</span>
        </div>
      </section>

      <div className="pp-body">
        <Section title="the short version">
          <p className="pp-lead">
            <small>in one line</small>
            Belltower has no accounts. What you save in the app stays on your iPhone. Besides loading public campus
            data, the only thing it sends is anonymous usage counts, so we can see which features people use.
          </p>
          <p>
            This policy covers the Belltower iOS app (&ldquo;Belltower&rdquo;, &ldquo;we&rdquo;), made by an
            independent developer. Belltower is unofficial and is not affiliated with the University of California,
            Riverside.
          </p>
        </Section>

        <Section title="what stays on your device">
          <p>
            Your class schedule, saved events and clubs, starred dishes, dining filters, starred parking lot, tab order
            and other preferences are stored only on your iPhone. Belltower&apos;s widgets and Siri shortcuts read them
            from there. We never receive them, and deleting the app deletes them.
          </p>
        </Section>

        <Section title="public campus data" note="where each feature loads from">
          <p>
            Belltower loads public information directly from these sources. Like any website you visit, they can see
            your device&apos;s IP address when the app asks them for data. Belltower doesn&apos;t send them anything
            about you.
          </p>
          <table className="pp-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map(([feature, source]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  <td>{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            When you book a study room, the booking is completed on UCR&apos;s LibCal website, under that site&apos;s
            own privacy policy.
          </p>
        </Section>

        <Section title="anonymous analytics" note="which features get used">
          <p>
            Belltower records anonymous usage events, such as which screens and features you open and which buttons
            you tap, so we can see which features are popular and what to improve. Along with each event we may
            receive basic technical details like the app version, iOS version and device model.
          </p>
          <p>
            These events aren&apos;t linked to your name, email address or any account, and they don&apos;t include
            your class schedule, saved items, location or anything you type. We don&apos;t sell this data, and we
            don&apos;t use it to track you across other apps or websites.
          </p>
        </Section>

        <Section title="ads" note="local businesses only">
          <p>
            Belltower doesn&apos;t show ads today. In the future it may show ads from local businesses near campus.
            If it does, we&apos;ll choose those ads ourselves. Belltower won&apos;t use ad networks like Apple or
            Google ads, and won&apos;t share your data with advertisers or use it to target ads at you.
          </p>
        </Section>

        <Section title="permissions" note="all optional, all on-device">
          <ul>
            <li>
              <b>Location</b> (optional) shows where you are on the campus map. It&apos;s used only on your device and
              is never sent to us.
            </li>
            <li>
              <b>Notifications</b> (optional) are scheduled on your device to tell you when a favorite dish is served.
            </li>
            <li>
              <b>Calendar</b> (optional, add-only) lets you add events you choose. Belltower can&apos;t read your
              calendar.
            </li>
            <li>
              <b>Live Activities</b> show your next class on the Lock Screen, from the schedule saved on your device.
            </li>
          </ul>
        </Section>

        <Section title="feedback">
          <p>If you email us, we&apos;ll see your email address and whatever you include, and use it only to reply.</p>
        </Section>

        <Section title="children">
          <p>Belltower is meant for college students and isn&apos;t directed to children under 13.</p>
        </Section>

        <Section title="your choices">
          <p>You can turn any permission off in Settings, and delete everything Belltower stores by deleting the app.</p>
        </Section>

        <Section title="changes">
          <p>If this policy changes, we&apos;ll update it here and change the date at the top.</p>
        </Section>

        <Section title="contact">
          <p>
            <a className="pp-mail" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </Section>
      </div>

      <footer className="lp-foot">
        <span>Unofficial. Not affiliated with UC Riverside.</span>
        <a href={`${base}/`}>Back to Belltower</a>
      </footer>
    </div>
  );
}
