import pg from "pg";
import { env } from "./env.js";
import { logger } from "./logger.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("error", (err) => {
  logger.error({ err }, "Postgres pool error");
});

export async function initDb() {
  try {
    await pool.query("select 1 as ok");
    logger.info({ ssl: true }, "Postgres connection ok");
  } catch (err) {
    logger.error({ err }, "Postgres connection failed");
    throw err;
  }
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}
