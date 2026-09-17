# BharatTrip

A Next.js travel platform for Himachal Pradesh, built from the architecture
in REQUIREMENTS.md and the UI spec in DESIGN-SPEC.md.

## Status

All 10 phases from REQUIREMENTS.md are built and verified end-to-end
(migrations run, admin CRUD tested authenticated, public pages rendering
real data, production build passing with zero type/lint errors):

- **Foundation** — Next.js 16 (App Router, TypeScript, Tailwind v4),
  PostgreSQL schema for every table in Phase 3 via Prisma
  (`prisma/schema.prisma`), admin auth (bcrypt + `iron-session` HTTP-only
  cookie, rate-limited login, `proxy.ts` guarding `/admin/*`)
- **Content modules**, each with full admin CRUD (list/create/edit/delete)
  and a public listing + detail page: Destinations, Places, Activities
  (Things To Do), Packages (with day-by-day itineraries, included/excluded,
  category tags), Blog & Travel Guides (shared table, categories/tags,
  reading-time estimate), Categories, Galleries
- **Media library** — real upload pipeline: `sharp` re-encodes and strips
  EXIF, stores to local disk in dev or S3/R2 when `STORAGE_*` env vars are
  set (`lib/media/storage.ts`), with a cover-image picker wired into the
  Destination form as the reuse pattern
- **Content relations** — polymorphic `content_relations` table with a
  working example (Nearby Destinations, admin-picked, shown on the public
  destination page)
- **Leads & settings** — public contact form (honeypot + rate-limited) that
  creates an Enquiry and best-effort emails it via Resend if configured;
  admin Enquiries list with status workflow; Navigation builder; Website
  Settings (site name, contact info, social links); Homepage section
  toggles; FAQs and Testimonials feeding the homepage
- **SEO layer** — per-page `generateMetadata` fallback chain (explicit SEO →
  content title/description → site-wide default from Settings), JSON-LD
  structured data (TouristDestination/Attraction/Trip, Article, FAQPage,
  BreadcrumbList), `app/sitemap.ts`, `app/robots.ts`
- **Hardening** — `/api/health` DB health check, honeypot + in-memory rate
  limiting on the two unauthenticated write paths (login, contact form),
  file-upload MIME/size validation

Full admin sidebar (17 sections) and every public route were crawled
authenticated/unauthenticated and confirmed returning 200 with real data.

**Deliberately out of scope for this pass** (call these out if you pick the
project back up): admin roles beyond a single Admin, a visual drag-and-drop
media picker (current one is a `<select>`), Sentry/error-monitoring wiring,
and the "related content" side of `content_relations` beyond the Nearby
Destinations example — the pattern is proven and easy to extend to
Package/Blog/Guide pairs the same way.

## Getting started

1. **Database.** Point `DATABASE_URL` in `.env` at a Postgres instance
   (local, Neon, or Supabase). For local dev with Docker:

   ```
   docker run -d --name bharattrip_pg -e POSTGRES_USER=bharattrip \
     -e POSTGRES_PASSWORD=bharattrip -e POSTGRES_DB=bharattrip \
     -p 5433:5432 postgres:16-alpine
   ```

   then set `DATABASE_URL="postgresql://bharattrip:bharattrip@localhost:5433/bharattrip?schema=public"`.

2. **Install & migrate.**

   ```
   npm install
   npx prisma migrate dev
   ```

3. **Create the first admin account** (see `scripts/seed-admin.ts` — disable
   or remove this script once you have an account, per Phase 9):

   ```
   npm run seed:admin -- --email you@example.com --password "change-me" --name "Your Name"
   ```

4. **Run it.**

   ```
   npm run dev
   ```

   Public site: <http://localhost:3000> — Admin: <http://localhost:3000/admin/login>

`.env.example` lists every environment variable. Object storage
(`STORAGE_*`) and email (`RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL`) are
optional in development — uploads fall back to local disk and enquiry
emails are silently skipped when unset.

## Reference docs

- **REQUIREMENTS.md** — the full architecture audit: information architecture
  (routes), database schema, Next.js app structure, admin CMS pattern, SEO
  architecture, security/auth, media architecture, deployment checklist, and
  the recommended build order.
- **DESIGN-SPEC.md** — the design tokens (colors, fonts, spacing) and
  screen-by-screen layout structure for the Homepage, Destination detail,
  Package listing, Package detail, and Admin dashboard, in the BharatTrip
  navy/orange brand theme.
- **design-reference/*.dc.html** — the raw mockup files from the design canvas
  (Homepage, Destination, PackageListing, PackageDetail, AdminDashboard).
  These use a Claude-only preview format (custom `<x-dc>` tags, a `support.js`
  runtime) and will **not run as-is** in a browser or Next.js — they're here
  only as a structural/copy reference (open them as text to see the exact
  markup, class names, and copy used for each section) alongside DESIGN-SPEC.md.
