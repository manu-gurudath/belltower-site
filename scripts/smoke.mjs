// End-to-end check of the Friends API against a running server and the real database.
// Usage: npm run start & npm run db:smoke  (BASE defaults to http://localhost:3000)
// Creates two throwaway users with sessions directly in Postgres (Apple sign-in can't run headless), exercises every
// route, then deletes them.
import { createHash, randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
import pg from 'pg';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
await db.connect();

const sha = (s) => createHash('sha256').update(s).digest();
async function makeUser(name) {
  const { rows } = await db.query('insert into users (apple_sub, name) values ($1, $2) returning id', [`smoke-${randomBytes(6).toString('hex')}`, name]);
  const token = randomBytes(32).toString('base64url');
  await db.query('insert into sessions (token_hash, user_id) values ($1, $2)', [sha(token), rows[0].id]);
  return { id: rows[0].id, token };
}
const call = async (method, path, token, body) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null };
};
const step = (name) => console.log(`✓ ${name}`);

const alex = await makeUser('Alex Rivera');
const sam = await makeUser('Sam Lee');
try {
  assert.equal((await call('GET', '/api/me')).status, 401);
  step('rejects requests without a session');

  const me = await call('GET', '/api/me', alex.token);
  assert.equal(me.data.user.name, 'Alex Rivera');
  step('GET /api/me');

  const section = {
    crn: '30123', subject: 'CS', number: '010A', section: '001', title: 'Intro to CS', type: 'Lecture', instructor: 'Ada L',
    meetings: [{ days: ['M', 'W', 'F'], start: '10:00', end: '10:50', building: 'Bourns', room: 'A125', type: 'Class', startDate: '2026-09-24', endDate: '2026-12-11' }],
    seatsOpen: 12, secret: 'dropped',
  };
  assert.equal((await call('PUT', '/api/schedule/202640', sam.token, { sections: [section], hash: 'h1' })).status, 204);
  const stored = await db.query('select sections from schedules where user_id = $1', [sam.id]);
  assert.equal(stored.rows[0].sections[0].seatsOpen, undefined);
  assert.equal(stored.rows[0].sections[0].secret, undefined);
  step('PUT /api/schedule strips unknown fields');

  assert.equal((await call('GET', '/api/friends?terms=202640', alex.token)).data.friends.length, 0);
  step('no friends before an invite');

  const invite = await call('POST', '/api/invites', sam.token);
  assert.match(invite.data.url, /\/i\/[0-9A-Z]{12}$/);
  step('POST /api/invites');

  const preview = await call('GET', `/api/invites/${invite.data.code}`);
  assert.equal(preview.data.owner.name, 'Sam');
  step('GET /api/invites/:code preview');

  assert.equal((await call('POST', `/api/invites/${invite.data.code}/accept`, sam.token)).status, 400);
  step('own invite is refused');

  const accepted = await call('POST', `/api/invites/${invite.data.code.toLowerCase()}/accept`, alex.token);
  assert.equal(accepted.status, 200);
  assert.equal(accepted.data.friend.name, 'Sam Lee');
  step('POST accept (case-insensitive code)');

  const friends = await call('GET', '/api/friends?terms=202640,202710', alex.token);
  assert.equal(friends.data.friends[0].name, 'Sam Lee');
  assert.equal(friends.data.friends[0].schedules['202640'].sections[0].crn, '30123');
  step('GET /api/friends returns schedules');

  const reverse = await call('GET', '/api/friends?terms=202640', sam.token);
  assert.equal(reverse.data.friends[0].name, 'Alex Rivera');
  step('friendship is mutual');

  await call('PATCH', '/api/me', sam.token, { sharingPaused: true });
  const paused = await call('GET', '/api/friends?terms=202640', alex.token);
  assert.equal(paused.data.friends[0].paused, true);
  assert.deepEqual(paused.data.friends[0].schedules, {});
  await call('PATCH', '/api/me', sam.token, { sharingPaused: false, name: '  Sam   L ' });
  assert.equal((await call('GET', '/api/me', sam.token)).data.user.name, 'Sam L');
  step('pause hides schedules; PATCH renames');

  assert.equal((await call('DELETE', `/api/friends/${alex.id}`, sam.token)).status, 204);
  assert.equal((await call('GET', '/api/friends?terms=202640', alex.token)).data.friends.length, 0);
  assert.equal((await call('POST', `/api/invites/${invite.data.code}/accept`, alex.token)).status, 404);
  step('remove friend also retires the remover’s invites');

  const aasa = await fetch(`${BASE}/.well-known/apple-app-site-association`);
  assert.equal(aasa.status, 200);
  assert.match(aasa.headers.get('content-type') ?? '', /json/);
  assert.ok((await aasa.json()).applinks.details[0].appIDs.includes('78H2VSK889.me.bymanu.belltower'));
  step('apple-app-site-association served as JSON, no redirect');

  const landing = await fetch(`${BASE}/i/${invite.data.code}`);
  assert.equal(landing.status, 200);
  assert.match(await landing.text(), /This invite has expired/);
  step('landing page renders');

  for (const path of ['/privacy-policy', '/privacy-policy/']) assert.equal((await fetch(BASE + path, { redirect: 'manual' })).status, 200, path);
  step('privacy policy works with and without trailing slash');

  const extra = await makeUser('Extra');
  assert.equal((await call('DELETE', '/api/auth/session', extra.token)).status, 204);
  assert.equal((await call('GET', '/api/me', extra.token)).status, 401);
  await db.query('delete from users where id = $1', [extra.id]);
  step('sign out ends the session on the server');

  assert.equal((await call('DELETE', '/api/me', sam.token, {})).status, 200);
  assert.equal((await db.query('select count(*)::int n from schedules where user_id = $1', [sam.id])).rows[0].n, 0);
  assert.equal((await call('GET', '/api/me', sam.token)).status, 401);
  step('DELETE /api/me removes the account and its data');
} finally {
  await db.query('delete from users where id = any($1)', [[alex.id, sam.id]]);
  await db.end();
}
console.log('All Friends API checks passed.');
