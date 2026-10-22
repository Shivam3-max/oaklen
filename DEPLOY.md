# Deploying Oaklen to Hostinger

Oaklen is a Next.js 15 app with a MySQL database (via Prisma). It needs a
Hostinger plan that runs **Node.js** — Business / Cloud web hosting (via
**Websites → Add website → Node.js Apps**) or a VPS. PHP-only shared plans
cannot run it.

## 1. Create the database
hPanel → **Databases → MySQL Databases**: create a database and user, and note
the database name, user, password and host (usually `localhost` on web hosting).

## 2. Create the Node.js app (Business / Cloud hosting)
1. hPanel → **Add website → Node.js Apps** → import from GitHub (this repo,
   branch `main`) — or upload a zip of the repo without `node_modules`/`.next`.
2. Build settings (usually auto-detected as Next.js):
   - Node version: **20.x or 22.x**
   - Install: `npm install`
   - Build: `npm run build`
   - Start: `npm start` (it listens on the `PORT` Hostinger provides)
3. Environment variables — paste them into the app's **Environment Variables**
   (or fill in the `.env` file and upload it to the app's root folder via File
   Manager; it is git-ignored so it never reaches GitHub):

   | Variable | |
   |---|---|
   | `DB_HOST` | from step 1, usually `localhost` — **required** |
   | `DB_NAME` | database name — **required** |
   | `DB_USER` | database user — **required** |
   | `DB_PASSWORD` | database password — **required** (special characters are fine) |
   | `DB_PORT` | optional, defaults to `3306` |
   | `OAKLEN_ADMIN_KEY` | strong passcode for `/admin` — **required** (admin is locked without it) |
   | `NEXT_PUBLIC_SITE_URL` | e.g. `https://oaklen.in` — **required** for correct SEO links |
   | `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_STAFF` | optional, email alerts |
   | `NEXT_PUBLIC_GA_ID` | optional, Google Analytics |

   `NEXT_PUBLIC_*` values are baked in at build time — redeploy after changing them.
4. Deploy.

## 3. Database tables — automatic
Every `npm run build` creates/updates the tables and loads the starter
catalogue (only into an empty database). If the database details are missing
or wrong, the build **does not fail** — it prints a `[db-setup]` warning and
the site deploys anyway, running without saving data (the admin shows a
warning). Fix the variables and redeploy, or run it by hand over SSH:

```bash
npm run db:setup
```

Schema changes that would delete data are refused, never applied silently.

Running it from your own computer instead? Run it from your own computer against the Hostinger database instead:
enable **Remote MySQL** in hPanel for your IP, put the `DB_*` values (with the
remote host as `DB_HOST`) in a local `.env`, then run `npm run db:setup` locally.

## VPS instead
```bash
git clone <repo> oaklen && cd oaklen
cp .env.example .env   # fill in the values
npm install
npm run db:setup
npm run build
PORT=3000 pm2 start npm --name oaklen -- start
```
Put Nginx (or Hostinger's VPS panel) in front as a reverse proxy to port 3000
and enable SSL.

## 4. First login
Open `https://yourdomain/admin` and sign in with `OAKLEN_ADMIN_KEY`.
- **Products** — add your real catalogue and up to 6 photos per piece.
- **Media** — upload photos for each section (sizes are shown).
- **Bookings** — customer bookings arrive here; move them through the atelier.

## Notes
- No payment is taken on the site — customers book by leaving contact details.
- Uploaded photos are stored in the database, so back it up from hPanel
  periodically.
- If the `DB_*` variables are missing the site still loads, but nothing is saved
  (in-memory fallback) — the admin shows a warning when this happens.
