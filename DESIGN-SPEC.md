# Travel Platform — UI Design Spec

Reference for implementing the Next.js UI. This describes the look built in the
"Travel Platform UI Design" canvas (5 screens: Homepage, Destination detail,
Package listing, Package detail, Admin dashboard). The canvas itself uses a
proprietary mockup format, so build the real components from this spec rather
than trying to port its markup directly.

## Design tokens

**Colors**
- Background (ivory): `#F7F4EC`
- Surface / cards: `#FFFFFF`
- Ink (primary text): `#1C2521`
- Ink soft (secondary text): `#6B7570`
- Border / hairline: `#E4DFD3`
- Placeholder fill: `#E7E2D4` (border `#D8D1BE`, label text `#8A8271`)
- Accent — navy (primary actions, links, wordmark "Bharat"): `#16244C`
- Accent — navy dark (hero/footer/admin sidebar backgrounds): `#0E1830`
- Accent — orange (CTAs, highlights, category tags, wordmark "Trip"): `#F4791E`

Matches the BharatTrip logo (navy mountains/wordmark, orange flight-path arc
and "Trip" in italic).

**Typography**
- Display / headings: `Fraunces` (Google Fonts, variable, weights 400–700)
- Body / UI: `Work Sans` (Google Fonts, weights 400–700)
- Scale: hero H1 ~60px, section H2 ~34px, card H3 ~18–19px, body 14–15px, meta/labels 12–13px uppercase tracked

**Shape & spacing**
- Cards: 12–14px border radius, 1px `#E4DFD3` border, no drop shadows except the floating hero search bar
- Buttons: pill-shaped (999px radius) for primary/secondary CTAs; 8px radius for form inputs
- Section padding: 64px horizontal on desktop, 72px vertical rhythm between sections
- Grid gaps: 20–24px between cards

**Principles (from the brief's UI/UX requirements)**
- Large imagery-led cards, generous whitespace, no gradients or heavy shadows
- Flat placeholder blocks stand in for photography until real images are wired up
- Admin panel uses a separate, denser visual language: dark navy sidebar (`#0E1830`), light content area (`#F3F5F3`), compact tables and stat tiles, no marketing typography (Work Sans only, no Fraunces)

## Screen-by-screen structure

**Homepage** (`/`) — Header nav → Hero with search card (destination / dates / travellers) → Featured Destinations (4-card grid) → Popular Travel Packages (3-card grid) → Things To Do (icon-row grid) → Popular Places (pill chips) → Latest Blog + Travel Guides → Photo Gallery preview (grid) → Why Choose Us (dark band, 4 columns) → Testimonials (3 cards) → FAQ (accordion-style list) → Newsletter band → Footer (4 columns).

**Destination detail** (`/destinations/[slug]`) — Breadcrumb → full-width cover photo → title row (name, location, Save/Enquire buttons) → two-column body: main column (About, Places to Visit grid, Things To Do chips, Packages for this destination, Related Blogs & Guides, Gallery) + sticky sidebar (Quick Facts, How to Reach, Enquiry CTA card, Nearby Destinations).

**Package listing** (`/packages`) — Header → title + count → filter chip row (category) → 3-column package card grid (photo, category tag, name, duration + destination, price, View Details) → pagination.

**Package detail** (`/packages/[slug]`) — Breadcrumb → photo gallery (1 large + 2 stacked) → title row (name, duration, price) → two-column body: main column (Overview, day-by-day Itinerary, Included/Excluded two-column list, FAQs) + sticky sidebar booking card (price, date/traveller inputs, Enquire / Call / WhatsApp buttons).

**Admin dashboard** (`/admin`) — Fixed dark sidebar (grouped nav: Dashboard, Content, Media, Website, Leads, SEO & Settings) → top bar (page title, search, avatar) → stat tile row (Destinations, Packages, Blog Posts, Published, Drafts) → two-column panel (Recent Content list with status badges, Recent Enquiries list with status badges).

## Implementation notes for Claude Code

- Load fonts via `next/font/google` (Fraunces + Work Sans) rather than a runtime `<link>`.
- Build the card grids, stat tiles, and status badges as small reusable components (`DestinationCard`, `PackageCard`, `StatTile`, `StatusBadge`) shared between the pages above — several screens reuse the same card shape.
- Replace every `[Photo]` / `[Cover Photo]` placeholder with `next/image` once real media exists; keep the same aspect ratios (destination card 200px, package card 220px, hero 660px, cover photo 420px).
- Status badge colors: Published/Converted → navy (`bg #E6EBF5`, text `#16244C`); Draft/New → orange (`bg #FDEAD9`, text `#F4791E`); Contacted/In Progress → blue-gray (`bg #EAEEF4`, text `#3D5A8A`); Closed → neutral gray.
