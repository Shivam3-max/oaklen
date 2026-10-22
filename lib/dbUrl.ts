// Builds the MySQL connection string from the separate DB_* variables that
// Hostinger hands out (host, database name, user, password). A full
// DATABASE_URL, if set, still wins. Returns "" when nothing is configured.
export function databaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_NAME || !DB_USER) return "";

  const user = encodeURIComponent(DB_USER);
  const pass = encodeURIComponent(DB_PASSWORD ?? "");
  return `mysql://${user}:${pass}@${DB_HOST || "localhost"}:${DB_PORT || "3306"}/${encodeURIComponent(DB_NAME)}`;
}
