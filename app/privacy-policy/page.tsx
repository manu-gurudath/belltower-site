import type { Metadata } from 'next';

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

export default function PrivacyPolicy() {
  return (
    <main className="wrap">
      <a className="brand" href={`${base}/`}>
        <img src={`${base}/icon.png`} alt="" />
        Belltower
      </a>

      <h1>Privacy Policy</h1>
      <p className="updated">Last updated November 23, 2026</p>

      <div className="card">
        <p className="lead">
          Belltower has no accounts, no ads and no analytics. What you save in the app stays on your iPhone. The only
          information that leaves it is what&apos;s needed to load public campus data and to handle purchases.
        </p>
      </div>

      <p>
        This policy covers the Belltower iOS app (&ldquo;Belltower&rdquo;, &ldquo;we&rdquo;), made by an independent
        developer. Belltower is unofficial and is not affiliated with the University of California, Riverside.
      </p>

      <h2>What stays on your device</h2>
      <p>
        Your class schedule, saved events and clubs, starred dishes, dining filters, starred parking lot, tab order and
        other preferences are stored only on your iPhone. Belltower&apos;s widgets and Siri shortcuts read them from
        there. We never receive them, and deleting the app deletes them.
      </p>

      <h2>Public campus data</h2>
      <p>
        Belltower loads public information directly from these sources. Like any website you visit, they can see your
        device&apos;s IP address when the app asks them for data. Belltower doesn&apos;t send them anything about you.
      </p>
      <table>
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
        When you book a study room, the booking is completed on UCR&apos;s LibCal website, under that site&apos;s own
        privacy policy.
      </p>

      <h2>Purchases</h2>
      <p>
        Payments are handled by Apple. We never see your name, email or payment details. To check whether you&apos;ve
        started the free week or bought Belltower, the app uses{' '}
        <a href="https://www.revenuecat.com/privacy">RevenueCat</a>, which receives a random anonymous ID created by
        the app, your purchase history from Apple, and basic device details such as the iOS version and country. This
        isn&apos;t linked to your identity and isn&apos;t used for advertising or tracking.
      </p>

      <h2>Permissions</h2>
      <ul>
        <li>
          <b>Location</b> (optional) shows where you are on the campus map. It&apos;s used only on your device and is
          never sent to us.
        </li>
        <li>
          <b>Notifications</b> (optional) are scheduled on your device to tell you when a favorite dish is served.
        </li>
        <li>
          <b>Calendar</b> (optional, add-only) lets you add events you choose. Belltower can&apos;t read your calendar.
        </li>
        <li>
          <b>Live Activities</b> show your next class on the Lock Screen, from the schedule saved on your device.
        </li>
      </ul>

      <h2>Feedback</h2>
      <p>
        If you email us, we&apos;ll see your email address and whatever you include, and use it only to reply.
      </p>

      <h2>Children</h2>
      <p>Belltower is meant for college students and isn&apos;t directed to children under 13.</p>

      <h2>Your choices</h2>
      <p>
        You can turn any permission off in Settings, and delete everything Belltower stores by deleting the app. To ask
        about the anonymous purchase record held by RevenueCat, email us.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, we&apos;ll update it here and change the date at the top.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>

      <footer>Belltower is unofficial and not affiliated with the University of California, Riverside.</footer>
    </main>
  );
}
