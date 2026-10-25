#!/usr/bin/env node
/**
 * Applies migration + seed using DATABASE_URL from .env.local
 * Get URI: Supabase → Project Settings → Database → Connection string (URI)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL in .env.local");
  console.error("Supabase → Settings → Database → URI (use postgres password)");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const files = [
  "supabase/migrations/20251025000000_initial_schema.sql",
  "supabase/seed-dev-menu.sql",
];

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(resolve(root, file), "utf8");
    console.log(`Running ${file}...`);
    try {
      await client.query(sql);
      console.log(`  OK`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        console.log(`  Skipped (already applied): ${msg.split("\n")[0]}`);
      } else {
        throw err;
      }
    }
  }
  console.log("Database bootstrap finished.");
} finally {
  await client.end();
}
