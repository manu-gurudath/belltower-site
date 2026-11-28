// Applies db/schema.sql over the direct (unpooled) connection. Usage: npm run db:migrate
import { readFileSync } from 'node:fs';
import pg from 'pg';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error('Set DATABASE_URL_UNPOOLED (run `neon env pull`).');

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));
  const { rows } = await client.query(`select table_name from information_schema.tables where table_schema = 'public' order by 1`);
  console.log('Tables:', rows.map((r) => r.table_name).join(', '));
} finally {
  await client.end();
}
