# Deploying Oaklen to Hostinger

Oaklen is a Next.js app with a MySQL database (via Prisma). Deploy it on a
Hostinger plan that supports **Node.js** (VPS, Cloud, or the Node.js hosting
option). Shared PHP-only plans cannot run it.

## 1. Create the database
In Hostinger hPanel → **Databases → MySQL**:
- Create a database and a user, note the host, database name, user and password.
- The connection string looks like:
  `mysql://USER:PASSWORD@HOST:3306/DBNAME`

## 2. Set environment variables
In your Node.js app's settings, add (see `.env.example`):
- `DATABASE_URL` — the MySQL string above (**required**)
- `OAKLEN_ADMIN_KEY` — a strong passcode for `/admin` (**required**)
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_STAFF` — optional, for email alerts
- `NEXT_PUBLIC_GA_ID` — optional, Google Analytics

## 3. Deploy from GitHub
Point Hostinger's Git deployment at this repo (or `git clone` it on the server),
then run:

```bash
npm install
npm run db:push      # creates the tables (run once, and after schema changes)
npm run db:seed      # loads the starter catalogue (run once)
npm run build
npm start            # serves on the PORT Hostinger provides
```

Use Hostinger's app manager (or PM2 on a VPS) to keep `npm start` running.

## 4. First login
Open `https://yourdomain/admin` and sign in with `OAKLEN_ADMIN_KEY`.
- **Products** tab — add your real catalogue and up to 6 photos per piece.
- **Media** tab — upload photos for each section (sizes are shown).
- **Bookings** tab — customer bookings arrive here; move them through the atelier.

## Notes
- No payment is taken on the site — customers book by leaving contact details,
  and you follow up. Nothing to configure for payments.
- Point your domain at the app and set `BRAND.domain` in `data/brand.ts` to the
  real URL so SEO/sitemap links are correct.
- The database is the source of truth; back it up from hPanel periodically.
