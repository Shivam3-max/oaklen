// Creates/updates the tables and loads the starter catalogue, using the same
// DB_* variables as the app.
//   npm run db:setup   — strict: fails loudly if anything goes wrong
//   --soft (used by `npm run build`) — never fails the build: skips when no
//   database is configured, and only warns if the database can't be reached
import { execSync } from "node:child_process";
import { databaseUrl } from "../lib/dbUrl";

const soft = process.argv.includes("--soft");

try {
  process.loadEnvFile(); // local / uploaded .env, if present
} catch {}

const url = databaseUrl();
if (!url) {
  const msg = "Database not configured — set DB_HOST, DB_NAME, DB_USER and DB_PASSWORD.";
  if (soft) {
    console.warn(`[db-setup] ${msg} Skipping; the site will run without saving data.`);
    process.exit(0);
  }
  console.error(msg);
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: url };
try {
  // Without --accept-data-loss, db push refuses any change that would drop data.
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", env });
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env });
} catch {
  if (!soft) process.exit(1);
  console.warn("[db-setup] Could not set up the database — continuing the build. Check the DB_* values, then run `npm run db:setup`.");
}
