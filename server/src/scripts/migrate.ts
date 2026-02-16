import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "../lib/db.js";
import { logger } from "../lib/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const schemaPath = path.resolve(__dirname, "../../db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  logger.info({ schemaPath }, "Running DB schema migration");

  await pool.query(sql);

  logger.info("DB schema migration complete");
  await pool.end();
}

main().catch((err) => {
  logger.error({ err }, "DB schema migration failed");
  process.exit(1);
});
