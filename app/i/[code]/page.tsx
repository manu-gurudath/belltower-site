import type { Metadata } from 'next';

import { findInvite, normalizeCode } from '../../../lib/server/invites';
import './invite.css';

const APP_STORE_URL = 'https://apps.apple.com/us/app/belltower-for-ucr/id6837758300';

type Props = { params: Promise<{ code: string }> };

// Invites change as they're used or revoked, so this page is never cached.
export const dynamic = 'force-dynamic';

const firstName = (name: string) => name.split(' ')[0];

async function load(code: string) {
  try {
    return await findInvite(code);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const invite = await load((await params).code);
  const title = invite ? `${firstName(invite.owner_name)} shared their schedule` : 'Belltower';
  return {
    title,
    description: 'See each other’s classes on Belltower.',
    openGraph: { title, description: 'See each other’s classes on Belltower.', images: ['/icon.png'] },
    robots: { index: false },
  };
}

export default async function InvitePage({ params }: Props) {
  const code = normalizeCode((await params).code);
  const invite = await load(code);
  const name = invite ? firstName(invite.owner_name) : null;

  return (
    <main className="inv">
      <img className="inv-icon" src="/icon.png" alt="" width={72} height={72} />
      {name ? (
        <>
          <div className="inv-avatar" aria-hidden>
            {initials(invite!.owner_name)}
          </div>
          <h1>{name} shared their schedule</h1>
          <p>See each other’s classes and when you’re both free.</p>
          <a className="inv-primary" href={`belltower://invite/${code}`}>
            Open in Belltower
          </a>
          <a className="inv-secondary" href={APP_STORE_URL}>
            Get Belltower
          </a>
          <p className="inv-note">After installing, tap this link again.</p>
        </>
      ) : (
        <>
          <h1>This invite has expired</h1>
          <p>Ask for a new link.</p>
          <a className="inv-secondary" href={APP_STORE_URL}>
            Get Belltower
          </a>
        </>
      )}
    </main>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}
