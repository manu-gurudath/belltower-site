import { attachDatabasePool } from '@vercel/functions';
import { Pool, type QueryResultRow } from 'pg';

// One pool per function instance. attachDatabasePool lets Vercel Fluid compute close idle clients before it suspends.
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 5_000 });
    attachDatabasePool(pool);
  }
  return pool;
}

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await getPool().query<T>(text, params);
  return rows;
}

/** Runs `task` on one connection inside BEGIN/COMMIT, rolling back if it throws. */
export async function transaction<T>(task: (q: <R extends QueryResultRow>(text: string, params?: unknown[]) => Promise<R[]>) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    const result = await task(async (text, params = []) => (await client.query(text, params)).rows);
    await client.query('commit');
    return result;
  } catch (e) {
    await client.query('rollback').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

export async function one<T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<T | null> {
  return (await query<T>(text, params))[0] ?? null;
}
