# BharatTrip — UI/UX Audit

**Scope:** Full codebase review of the public marketing site (`app/(public)/**`) and the admin CMS (`app/admin/**`), including every shared component in `components/public`, `components/admin`, and `components/shared`, plus the design tokens in `app/globals.css` and the intended design in `DESIGN-SPEC.md` / `REQUIREMENTS.md`.

**Method:** Static inspection only — every page, layout, and form component was read end‑to‑end and compared against (a) the project's own design spec, (b) the project's own requirements/architecture doc, and (c) general UI/UX and accessibility best practice. No code was changed as part of this audit. Findings are grounded in specific files/lines so they can be verified and actioned directly.

**How to read this document:** Issues are grouped first by scope (cross‑cutting, then page/component‑by‑component for Public, then Admin), and are tagged with an ID (`C-#` Critical, `H-#` High, `M-#` Medium, `L-#` Low) so they can be referenced from the priority table in [Section 7](#7-priority-index). A "What's already good" section ([Section 6](#6-whats-already-good--do-not-change)) is included so future work doesn't accidentally regress things that are working well.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design System Foundation](#2-design-system-foundation)
3. [Cross-Cutting / Global Issues](#3-cross-cutting--global-issues)
4. [Public Site — Page by Page](#4-public-site--page-by-page)
5. [Admin Panel — Area by Area](#5-admin-panel--area-by-area)
6. [What's Already Good — Do Not Change](#6-whats-already-good--do-not-change)
7. [Priority Index](#7-priority-index)

---

## 1. Executive Summary

The product has a genuinely coherent visual identity — the ivory/navy/orange palette, Fraunces + Work Sans pairing, pill buttons, and card treatments are applied consistently and match `DESIGN-SPEC.md` closely. The empty-state, status-badge, and slug-generation patterns show real UX thought.

However, the audit found a consistent pattern across the codebase: **several interactive affordances exist visually but are not wired up**, and **several safety-net screens (loading, error, 404) are entirely missing**. These are the two themes that dominate the Critical/High findings:

- **Non-functional or missing controls presented as functional:** the homepage hero "search" box is not an input, the destination page "Save" button has no handler, the gallery has no lightbox, and there is no mobile navigation menu at all — on a phone, most of the site's primary navigation is simply unreachable.
- **No loading/error/404 states anywhere in the app** (`app/**`): zero `loading.tsx`, `error.tsx`, or `not-found.tsx` files exist in either the public site or the admin panel, so any slow network, thrown error, or bad URL falls through to Next.js's bare default screens.
- **Admin CMS usability gaps that will surface as the site grows:** no search/filter/pagination on any content list, no way to edit an FAQ/Testimonial/Category/Nav item once created (only create + delete), and an image picker (`MediaPicker`) that is a text dropdown of filenames instead of the visual thumbnail grid the app already builds elsewhere (`GalleryForm`).
- **Accessibility baseline is thin:** a repo-wide search found **zero** `aria-*` attributes, **zero** `role` attributes, and **zero** custom focus-ring styling anywhere in the codebase — every focusable element relies on the browser's default outline being suppressed (`outline-none`) with only a 1px border-color change as a replacement, which is a real keyboard-navigation problem.

None of this requires a redesign — the design language is already right. This is primarily a "finish wiring up what's already drawn" and "add the missing safety-net screens" audit, plus a handful of admin-workflow gaps that will bite as real content volume grows.

---

## 2. Design System Foundation

Reviewed: `app/globals.css`, `DESIGN-SPEC.md`, font loading in `app/layout.tsx`.

### 2.1 Color tokens
The palette (`--color-ivory`, `--color-navy`, `--color-orange`, status colors, admin-specific `--color-admin-sidebar` / `--color-admin-surface`) is defined once as CSS variables and consumed via Tailwind's `@theme inline`, exactly as `DESIGN-SPEC.md` specifies. This is a solid, low-risk foundation — **do not restructure this**, just extend it (see M-9, L-8 below for the one semantic-reuse nitpick).

### 2.2 Typography
`Fraunces` (display) and `Work Sans` (body) are loaded via `next/font/google` with explicit weights, avoiding layout shift and matching the spec's font-loading guidance precisely. Heading hierarchy (`text-4xl`/`text-3xl`/`text-2xl`/`text-lg` mapped to h1/h2/h3) is applied consistently across every page — this was one of the most consistently-executed parts of the codebase.

**Gap:** there is no defined type scale for **long-form body content**. Blog/guide article bodies render as a single `text-sm leading-relaxed` block with no distinct paragraph spacing, pull quotes, inline headings, or image breaks (see [H-6](#h-6-no-rich-text-editing-or-rendering-for-blogguide-content)) — this is as much a content-model gap as a typographic one.

### 2.3 Spacing & shape
Section rhythm (`py-20`/`py-16`), card radius (`rounded-xl` ≈ 12px), pill buttons (`rounded-full`), and 8px-radius form inputs (`rounded-lg`) all match the spec's "Shape & spacing" section. Grid gaps (`gap-4`–`gap-6`) are applied consistently between card grids.

### 2.4 Iconography
There is effectively **no icon system** in the product. The only icon-like element in the entire codebase is a plain bullet character (`●`) used as a placeholder "icon" for Things-To-Do tiles on the homepage (`app/(public)/page.tsx:148-150`). There's no icon for the (missing) mobile menu, no icons in the admin sidebar next to each section, no social icons in the footer (plain text labels instead), and no icon library dependency in `package.json`. This is fine as a deliberate "no icons yet" placeholder phase, but it's worth calling out as a gap rather than a finished decision — see [M-11](#m-11-no-icon-system).

---

## 3. Cross-Cutting / Global Issues

These issues recur across many pages/components rather than belonging to one screen, so they're listed once here instead of being repeated in every page section below.

### C-1: No mobile navigation menu
- **Issue:** `components/public/Header.tsx` renders the nav links in `<nav className="hidden items-center gap-8 lg:flex">` — visible only at `lg` (1024px) and above. There is no hamburger icon, no toggle button, no drawer/sheet component, and no client-side state for a mobile menu anywhere in the file (it isn't even a Client Component).
- **Why it's a problem:** Below 1024px — i.e., every phone and most tablets — a visitor can only reach `/` and `/contact` (via the "Enquire Now" button). Destinations, Places, Packages, Things To Do, Blog, Guides, and Gallery are all completely unreachable from the header on mobile. This affects the majority of real-world traffic to a consumer travel site.
- **Recommended improvement:** Add a hamburger/menu-icon button visible below `lg`, wired to a slide-in or dropdown panel listing the same `navLinks`, with a visible close control and focus trapped inside while open.
- **Expected UI/UX behavior:** Tapping the menu icon reveals all primary nav links plus the Enquire Now CTA; tapping a link or an outside-tap/Escape closes it; the toggle button has `aria-expanded`/`aria-controls` for accessibility.
- **Affected page/component:** `components/public/Header.tsx` (site-wide, every public page).
- **Priority:** Critical

### C-2: No loading, error, or not-found states anywhere in the app
- **Issue:** A repo-wide search for `loading.tsx`, `error.tsx`, and `not-found.tsx` under `app/` returned **zero results**. Every route (public and admin) relies entirely on Next.js's built-in default behavior for slow loads, thrown errors, and 404s.
- **Why it's a problem:** Slow data fetches (destination pages, admin tables) show a fully blank white screen with no feedback. Any unhandled server error shows Next.js's generic error screen with no brand, no "go home" link, no support contact. Mistyped URLs (`notFound()` is called in several detail pages) fall through to the default bare 404 page instead of an on-brand one.
- **Recommended improvement:** Add a root `app/loading.tsx` (and per-route ones for data-heavy pages like admin lists), a root `app/error.tsx` client boundary with a friendly message + "Try again"/"Go home" actions, and a root `app/(public)/not-found.tsx` + `app/admin/not-found.tsx` styled with the site's actual header/footer/sidebar chrome.
- **Expected UI/UX behavior:** A slow page shows a skeleton or spinner instead of a blank screen; a broken page shows a branded "Something went wrong" screen with a retry action; a bad URL shows a branded 404 with a link back to the homepage/destinations.
- **Affected page/component:** Entire app (`app/**`).
- **Priority:** Critical

### H-1: Zero accessibility (ARIA) attributes in the codebase
- **Issue:** A repo-wide search for `aria-label`, `aria-current`, and `role=` across every `.tsx` file returned **zero matches**. There is no `<nav aria-label>`, no `aria-current="page"` on active nav links, no `aria-expanded` on any toggle, and no `role="alert"` on form error messages.
- **Why it's a problem:** Screen-reader users get no differentiation between the multiple `<nav>`-like regions (header nav vs. footer link columns), no indication of which page/section is currently active, and form validation errors (e.g., `ContactForm`'s `errors.name`) are inserted as plain `<p>` tags that won't be announced when they appear.
- **Recommended improvement:** Add `aria-label` to the header `<nav>` and footer link groups, `aria-current="page"` to the active link in both the public header and the admin sidebar (see H-3), and `role="alert"`/`aria-live="polite"` on inline form error text so assistive tech announces validation failures without requiring a page reload.
- **Expected UI/UX behavior:** A keyboard/screen-reader user can identify which nav region they're in, which page is active, and hears validation errors as soon as they appear.
- **Affected page/component:** Site-wide — `Header.tsx`, `Footer.tsx`, `Sidebar.tsx`, every form component.
- **Priority:** High

### H-2: Focus states are effectively invisible
- **Issue:** Every text input and select across the app uses the exact same class fragment: `outline-none focus:border-navy` (see `FormField.tsx:2`, `ContactForm.tsx:9`, `LoginForm.tsx`). This removes the browser's default focus ring and replaces it with only a 1px border-color change from `#E4DFD3` to `#16244C`. Buttons and links have **no** focus-visible styling defined at all — a repo-wide search for `focus-visible`/`focus:ring`/`focus:outline` returned zero matches anywhere.
- **Why it's a problem:** A 1px border color shift is a very weak focus indicator, especially at a glance or in bright light, and buttons/links (including every card, nav link, and CTA) have no visible focus indicator whatsoever. Keyboard-only users (and WCAG 2.4.7) cannot reliably tell what's focused when tabbing through the site.
- **Recommended improvement:** Add a visible `focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2` (or similar) treatment to all interactive elements — inputs, buttons, links, and cards — not just form fields.
- **Expected UI/UX behavior:** Tabbing through any page shows a clear, high-contrast ring around whatever element currently has focus.
- **Affected page/component:** Site-wide (all forms, all links, all buttons).
- **Priority:** High

### M-1: No visual indicator for required form fields
- **Issue:** Every form (`ContactForm`, `LoginForm`, `DestinationForm`, `PackageForm`, etc.) marks fields as `required` at the HTML level but never shows an asterisk, "(required)" label, or any other visual cue before the user attempts to submit.
- **Why it's a problem:** Users can't tell which fields are mandatory until they try to submit and hit browser-native validation, which is jarring and inconsistent with the site's otherwise-polished styling (native validation bubbles don't match the design system at all).
- **Recommended improvement:** Add a small `*` or "Required" microcopy next to required field labels, styled consistently via the shared `Field` component so it propagates everywhere at once.
- **Expected UI/UX behavior:** A user scanning a form before filling it in can immediately see which fields are mandatory.
- **Affected page/component:** `components/admin/FormField.tsx`, `components/public/ContactForm.tsx`, `components/admin/LoginForm.tsx`, and every form built on top of them.
- **Priority:** Medium

### M-2: No hover feedback on admin table rows
- **Issue:** Every admin list table (`AdminDestinationsPage`, `AdminEnquiriesPage`, `AdminNavigationPage`, `AdminFaqsPage`, `AdminTestimonialsPage`, `AdminCategoriesPage`) renders `<tr>` with no hover class at all.
- **Why it's a problem:** In a dense data table, hover feedback is a basic scanning aid — its absence makes it harder to track which row your cursor is over, especially in tables where the row height is small and actions are at the far right edge.
- **Recommended improvement:** Add `hover:bg-admin-surface` (or similar) to every table row across the admin panel.
- **Expected UI/UX behavior:** Hovering any table row gives a subtle background highlight.
- **Affected page/component:** All admin list tables.
- **Priority:** Medium

### M-3: Destructive actions rely on the browser's native `confirm()` dialog
- **Issue:** `ConfirmSubmitButton` (`components/admin/ConfirmSubmitButton.tsx`) calls `window.confirm(confirmMessage)` for every delete action across the entire admin panel (destinations, packages, places, blog, guides, activities, galleries, media, FAQs, testimonials, categories, navigation items, enquiries).
- **Why it's a problem:** It works, but the native browser dialog is visually jarring against the custom-styled admin UI, can't be styled to match the brand, and offers no additional context (e.g., "used on 3 published pages") beyond a generic string.
- **Recommended improvement:** This is a reasonable v1 pattern and low-risk to leave as-is short term; if/when time allows, replace with a styled confirmation modal component consistent with the design system. Not urgent since it is at least a consistent pattern everywhere.
- **Expected UI/UX behavior:** A branded confirmation dialog/modal instead of the browser-native one, ideally naming what will be affected.
- **Affected page/component:** `components/admin/ConfirmSubmitButton.tsx` (used site-wide in admin).
- **Priority:** Low *(downgraded from Medium — consistency is more important than the native-dialog aesthetic here; flagged for awareness, not urgent action)*

---

## 4. Public Site — Page by Page

### 4.1 Header & Footer (`components/public/Header.tsx`, `Footer.tsx`)

See [C-1](#c-1-no-mobile-navigation-menu) for the mobile nav gap (the single biggest issue on the public site).

#### H-3: No "active page" indicator in the header nav
- **Issue:** `navLinks.map(...)` in `Header.tsx` applies the same `text-ink-soft hover:text-navy` class to every link regardless of the current route — there's no `usePathname()` check or `aria-current` anywhere.
- **Why it's a problem:** Users lose a basic orientation cue ("which section am I in?") that's standard on virtually every content site.
- **Recommended improvement:** Convert `Header` nav rendering to compare the current pathname (via `usePathname()` in a small client sub-component, or pass the pathname from a layout) and apply an active style (e.g., `text-navy font-semibold` + `aria-current="page"`) to the matching link.
- **Expected UI/UX behavior:** Whichever top-level section you're browsing (e.g., "Destinations") is visually distinguished in the header while you're anywhere under `/destinations/*`.
- **Affected page/component:** `components/public/Header.tsx`.
- **Priority:** High

#### M-4: Footer has two links pointing to the same destination
- **Issue:** In `Footer.tsx`'s `columns` array, the "Company" group lists both "Contact Us" and "Plan a Trip" pointing to the identical `href: "/contact"`.
- **Why it's a problem:** Two differently-worded links that go to the exact same page is confusing — a user clicking "Plan a Trip" expecting a distinct planning flow lands on the same generic contact form, which undersells the "Plan a Trip" framing.
- **Recommended improvement:** Either differentiate the destination (e.g., deep-link `/contact?intent=plan`) or remove one of the two duplicate entries.
- **Expected UI/UX behavior:** Every footer link should have a clearly distinct purpose/destination from every other link in the same column.
- **Affected page/component:** `components/public/Footer.tsx`.
- **Priority:** Medium

#### L-1: Social links show plain text labels instead of icons
- **Issue:** The footer's "Follow" column renders `{ label: "Facebook", href: ... }` as plain text links, no icons.
- **Why it's a problem:** Purely a polish issue — social platforms are near-universally recognized by icon/wordmark rather than plain text, and icon buttons are more compact and scannable.
- **Recommended improvement:** Swap in simple SVG icons for each platform once an icon strategy is chosen (see M-11).
- **Expected UI/UX behavior:** Recognizable platform icons in the footer's Follow section.
- **Affected page/component:** `components/public/Footer.tsx`.
- **Priority:** Low

---

### 4.2 Homepage (`app/(public)/page.tsx`)

#### C-3: Hero "search" box is a non-functional decoy
- **Issue:** The hero section renders `<span className="...">Search a destination…</span>` — a styled `<span>`, not an `<input>`. The adjacent "Search" button is just a `<Link href="/destinations">` that ignores whatever the user might have expected to type.
- **Why it's a problem:** It is visually indistinguishable from a real search field (white pill, placeholder-style text, sits next to a "Search" button) but is completely inert — a user who clicks into it and starts typing will get no response at all, and "Search" always sends them to the unfiltered destinations list regardless of intent. This is a deceptive-looking affordance on the site's most prominent above-the-fold element.
- **Recommended improvement:** Either implement a real destination search/autocomplete (client component hitting a search server action, exactly as scoped in `REQUIREMENTS.md` Phase 4: "search box... client component"), or — if not ready for this release — restyle it as a set of prominent browse links/pills ("Popular: Manali, Shimla, Spiti…") so it doesn't visually impersonate an input.
- **Expected UI/UX behavior:** Typing a destination name and pressing Search/Enter filters or navigates to matching results; if search isn't implemented yet, the element shouldn't be styled to look like a text field.
- **Affected page/component:** `app/(public)/page.tsx:65-76` (hero section).
- **Priority:** Critical

#### M-5: Package cards are duplicated inline instead of reusing a shared component
- **Issue:** The homepage's "Popular Travel Packages" section (`app/(public)/page.tsx:107-129`) and the `/packages` listing page (`app/(public)/packages/page.tsx:26-48`) both hand-roll the exact same package-card markup independently, rather than sharing a `PackageCard` component the way `DestinationCard` and `BlogCard` are shared.
- **Why it's a problem:** Any future visual tweak to the package card (spacing, badge, hover state) now has to be made in two places and will silently drift out of sync — this already happened partially (see M-6 below on the missing image).
- **Recommended improvement:** Extract a `PackageCard` component (mirrored on `DestinationCard`) and use it in both places, per the design spec's own guidance ("Build the card grids... as small reusable components").
- **Expected UI/UX behavior:** Package cards look and behave identically everywhere they appear, and are only maintained in one place.
- **Affected page/component:** `app/(public)/page.tsx`, `app/(public)/packages/page.tsx`.
- **Priority:** Medium

#### L-2: "Ready to plan your trip?" CTA band reuses the "draft" status color token
- **Issue:** The closing CTA band (`app/(public)/page.tsx:262`) uses `bg-status-draft-bg`, a token semantically defined for the admin's Draft/New status badge, purely because it happens to be a light orange tint.
- **Why it's a problem:** Not a visible bug today, but it couples an unrelated marketing surface to an admin semantic token — if the "draft" badge color is ever changed for admin-specific reasons, this public CTA band changes color as an unintended side effect.
- **Recommended improvement:** Add a small dedicated token (e.g., `--color-cta-band-bg`) for this use, even if it's currently the same hex value.
- **Expected UI/UX behavior:** No visible change; this is a maintainability/token-hygiene note.
- **Affected page/component:** `app/(public)/page.tsx`.
- **Priority:** Low

---

### 4.3 Destinations — Listing & Detail (`app/(public)/destinations/**`)

#### C-4: "Save" button on destination detail page does nothing
- **Issue:** `app/(public)/destinations/[slug]/page.tsx:106-108` renders `<button className="...">Save</button>` with no `onClick`, no form action, and the page itself is a Server Component (no client interactivity possible at that button at all).
- **Why it's a problem:** It's styled identically to the real, working "Enquire" button right next to it, so visitors have no way to know it's inert until they click it and nothing happens — a broken promise on a key engagement feature (wishlisting/saving destinations).
- **Recommended improvement:** Either implement the save/wishlist feature (would need a lightweight client-side mechanism — localStorage for anonymous users, or an authenticated flow) or remove the button until it's ready, rather than shipping a dead control.
- **Expected UI/UX behavior:** Clicking "Save" gives some visible confirmation (e.g., icon fills in, toast confirms, button label changes to "Saved") and the saved state persists across a visit.
- **Affected page/component:** `app/(public)/destinations/[slug]/page.tsx`.
- **Priority:** Critical

#### H-4: Sidebar cards on Destination/Package detail pages aren't actually sticky
- **Issue:** The design spec explicitly calls for a "sticky sidebar" on both the destination detail page and the package detail page's booking card. In the actual code, both `<aside>` elements use only `className="h-fit space-y-6 rounded-xl border..."` — no `sticky top-*` class is present anywhere in either file (confirmed via repo-wide search for `sticky`, zero matches in `app/`).
- **Why it's a problem:** On a long destination or package page (itinerary, included/excluded, FAQs can push the main column well past one viewport height), the Enquire/booking card scrolls out of view immediately, removing the persistent conversion prompt the design was built around.
- **Recommended improvement:** Add `sticky top-24` (accounting for the sticky header's height) to both aside elements, with a `max-h-[calc(100vh-...)] overflow-y-auto` safeguard for very long sidebars.
- **Expected UI/UX behavior:** The Enquire/booking card stays visible in the viewport as the visitor scrolls through the main content column, matching the design spec.
- **Affected page/component:** `app/(public)/destinations/[slug]/page.tsx`, `app/(public)/packages/[slug]/page.tsx`.
- **Priority:** High

#### M-6: Place cards show no imagery, inconsistent with every other card type
- **Issue:** `/places` listing (`app/(public)/places/page.tsx:27-36`) renders each place as a plain text card (name + destination) with no photo/placeholder block at all, while `DestinationCard` and `BlogCard` both have a dedicated image/placeholder area.
- **Why it's a problem:** For a visually-led travel product, a listing page with no imagery reads as noticeably less finished than its siblings, and breaks the card-grid visual rhythm when a user navigates between `/destinations`, `/blog`, and `/places` back to back.
- **Recommended improvement:** Add an image/placeholder block to the places listing card (places have a `destination` relation with a cover image that could be reused, or places could get their own optional image field).
- **Expected UI/UX behavior:** Place cards visually match the treatment used for destination and blog cards.
- **Affected page/component:** `app/(public)/places/page.tsx`.
- **Priority:** Medium

---

### 4.4 Packages — Listing & Detail (`app/(public)/packages/**`)

#### H-5: Package detail booking sidebar is missing the date/traveller inputs and WhatsApp CTA called for in the spec
- **Issue:** `DESIGN-SPEC.md` describes the package detail sidebar as "sticky sidebar booking card (price, date/traveller inputs, Enquire / Call / WhatsApp buttons)". The actual sidebar (`app/(public)/packages/[slug]/page.tsx:192-214`) only has price, an "Enquire Now" link, and a "Call Us" link — no date/traveller fields, no WhatsApp option.
- **Why it's a problem:** WhatsApp is a very high-intent, low-friction contact channel for Indian travel customers specifically, and its absence removes an easy conversion path. The missing date/traveller inputs mean a visitor's trip context is lost — clicking Enquire drops them into a generic contact form that re-asks everything from scratch (see M-7 below).
- **Recommended improvement:** Add a `wa.me` link CTA alongside Call/Enquire, and consider a lightweight date/traveller-count widget that pre-fills the contact form via query params.
- **Expected UI/UX behavior:** Three clear contact channels (Enquire, Call, WhatsApp) matching the spec, with trip context carried forward where possible.
- **Affected page/component:** `app/(public)/packages/[slug]/page.tsx`.
- **Priority:** High

#### M-7: "Enquire" CTAs never pass context to the contact form
- **Issue:** Every "Enquire"/"Enquire Now"/"Enquire about X" link across destination, package, and activity detail pages is a plain `<Link href="/contact">` with no query params, and `ContactForm` has no destination/package pre-fill fields even though the `Enquiry` model (per `REQUIREMENTS.md`) supports `destination_id`/`package_id`.
- **Why it's a problem:** A visitor who was just looking at "5-Day Spiti Valley Package" and clicks Enquire lands on a completely blank, generic form and has to re-type/re-explain what they were interested in — extra friction on the one action the whole site exists to drive.
- **Recommended improvement:** Pass `?destination=slug` or `?package=slug` in the Enquire links and have `ContactForm`/`createEnquiryAction` pre-fill a hidden field (and ideally show a small "Enquiring about: [Name]" chip above the form) so the context isn't lost.
- **Expected UI/UX behavior:** Clicking "Enquire about Manali" visibly carries that context into the contact form.
- **Affected page/component:** `app/(public)/destinations/[slug]/page.tsx`, `app/(public)/packages/[slug]/page.tsx`, `app/(public)/things-to-do/[slug]/page.tsx`, `components/public/ContactForm.tsx`.
- **Priority:** Medium

#### L-3: Package "Photo" gallery blocks are static — no lightbox
- **Issue:** The 1-large + 2-stacked photo layout at the top of the package detail page (`app/(public)/packages/[slug]/page.tsx:80-92`) has no click handler even as a placeholder — once real photos are wired in, there's nothing to click through to a larger view.
- **Why it's a problem:** Minor today since these are just placeholder blocks, but worth flagging now (alongside the identical gap in the Gallery feature itself, [H-7](#h-7-gallery-has-no-lightboxzoom-interaction)) so it's designed in from the start rather than retrofitted.
- **Recommended improvement:** Plan for the same lightbox component to be reused here once real images exist.
- **Expected UI/UX behavior:** Clicking any package photo opens a larger view/lightbox.
- **Affected page/component:** `app/(public)/packages/[slug]/page.tsx`.
- **Priority:** Low

---

### 4.5 Things To Do (`app/(public)/things-to-do/**`)

No unique structural problems beyond the cross-cutting issues above — listing and detail pages follow the same solid pattern as Places (breadcrumb, tag chips for duration/difficulty/season, price, description, safety-info callout). The difficulty/season/duration chips (`app/(public)/things-to-do/[slug]/page.tsx:58-74`) are a nice small touch — clear, scannable metadata without needing a table.

#### L-4: Difficulty badge has no visual severity coding
- **Issue:** `activity.difficulty` renders as a plain `rounded-full border` chip with the same neutral styling regardless of whether it says "Easy", "Moderate", or "Difficult".
- **Why it's a problem:** Difficulty is safety-relevant information for adventure activities — a user scanning quickly benefits from color-coding (e.g., green/amber/red) more than from a same-styled chip they have to read the text of every time.
- **Recommended improvement:** Map difficulty levels to distinct (but on-brand, not traffic-light-garish) chip colors.
- **Expected UI/UX behavior:** Difficulty level is distinguishable at a glance, not just by reading text.
- **Affected page/component:** `app/(public)/things-to-do/[slug]/page.tsx`.
- **Priority:** Low

---

### 4.6 Blog & Guides (`app/(public)/blog/**`, `app/(public)/guides/**`)

#### H-6: No rich text editing or rendering for blog/guide content
- **Issue:** `BlogForm`'s content field is a plain `<textarea>` (`components/admin/BlogForm.tsx:73-80`), and the public article pages render `post.body`/`guide.body` as `<div className="whitespace-pre-line">{body}</div>` — raw text with line breaks preserved, no headings, bold, links, lists, or inline images possible within the article body.
- **Why it's a problem:** For a content-driven travel site where blog/guide articles are a primary SEO and engagement surface, the inability to format a single word, insert a mid-article image, or link out is a significant content-quality ceiling — every article will read as an undifferentiated wall of plain text no matter how well-written.
- **Recommended improvement:** Add a lightweight rich-text/markdown editor to `BlogForm` (even a minimal Markdown textarea + preview would be a major step up) and render the stored content as formatted HTML/Markdown on the public page instead of raw `whitespace-pre-line`.
- **Expected UI/UX behavior:** Editors can format text and insert images inline; readers see properly typeset articles with headings, emphasis, and inline media.
- **Affected page/component:** `components/admin/BlogForm.tsx`, `app/(public)/blog/[slug]/page.tsx`, `app/(public)/guides/[slug]/page.tsx`.
- **Priority:** High

#### M-8: Article pages have no related content, share, or author-avatar treatment
- **Issue:** Blog/guide detail pages end abruptly after the tag list — no "related articles," no social-share buttons, no author photo (just `By {name}` as plain text).
- **Why it's a problem:** These are standard, low-effort engagement/retention features for editorial content — without them, every article is a dead end that sends the reader back to the listing page or away from the site entirely.
- **Recommended improvement:** Add a "Related articles" section (can reuse the existing `content_relations` polymorphic table already in the schema) and simple share links (mailto/WhatsApp/X) below the article body.
- **Expected UI/UX behavior:** Finishing an article surfaces 2-3 related reads and an easy way to share.
- **Affected page/component:** `app/(public)/blog/[slug]/page.tsx`, `app/(public)/guides/[slug]/page.tsx`.
- **Priority:** Medium

#### L-5: Category chip on blog post uses the "draft" status color token
- **Issue:** Category chips on the blog post page (`app/(public)/blog/[slug]/page.tsx:83`) use `bg-status-draft-bg text-status-draft-text` — the same admin "Draft" semantic token noted in L-2.
- **Why it's a problem:** Same token-hygiene concern as L-2 — works visually today (happens to be a pleasant light-orange chip) but borrows a semantically-unrelated token.
- **Recommended improvement:** Introduce a neutral "tag/category chip" token distinct from the admin status-badge palette.
- **Expected UI/UX behavior:** No visible change; maintainability note.
- **Affected page/component:** `app/(public)/blog/[slug]/page.tsx`.
- **Priority:** Low

---

### 4.7 Gallery (`app/(public)/gallery/**`)

#### H-7: Gallery has no lightbox/zoom interaction
- **Issue:** `app/(public)/gallery/[slug]/page.tsx:31-37` renders every image in a static grid (`<div>` wrapping a `next/image`) with no click handler, no modal, no keyboard-navigable full-size view. `REQUIREMENTS.md`'s own architecture notes explicitly name "gallery lightbox" as one of only three client-interactive pieces the whole public site needs — it was never built.
- **Why it's a problem:** A "Photo Gallery" feature whose only interaction is "look at a grid of thumbnails" undersells the content and is a poor experience for a page whose entire purpose is showcasing photography — users can't see any image at a larger size at all.
- **Recommended improvement:** Add a lightbox (click a thumbnail → full-size overlay with next/prev navigation and Escape-to-close), as a small dedicated Client Component per the architecture doc's own plan.
- **Expected UI/UX behavior:** Clicking any gallery photo opens it full-size with next/previous navigation.
- **Affected page/component:** `app/(public)/gallery/[slug]/page.tsx`, `app/(public)/gallery/page.tsx`.
- **Priority:** High

---

### 4.8 Contact (`app/(public)/contact/page.tsx`, `components/public/ContactForm.tsx`)

#### M-9: Honeypot field is absolutely positioned without a relative container
- **Issue:** `ContactForm.tsx:30` renders the anti-spam honeypot as `<div className="absolute -left-[9999px]" aria-hidden="true">` directly inside the `<form>`, but neither the form nor any ancestor has `position: relative` set.
- **Why it's a problem:** An `absolute`-positioned element with no positioned ancestor is placed relative to the nearest positioned ancestor up the tree (or the initial containing block), which risks pushing the page's scrollable width and causing an invisible horizontal-scroll sliver — a well-known CSS footgun. It happens to be visually invisible either way, but the layout side effect (extra scrollable area, or off-screen tab stop reachable by keyboard before the honeypot's own `tabIndex={-1}` mitigation) is unintended.
- **Recommended improvement:** Add `className="relative"` to the `<form>` element (or wrap the honeypot in a `relative` container) so the absolute positioning is properly scoped.
- **Expected UI/UX behavior:** No visible change; this is a defensive CSS-correctness fix.
- **Affected page/component:** `components/public/ContactForm.tsx`.
- **Priority:** Medium

#### M-10: Phone field lacks `type="tel"`, travel-date field has no minimum
- **Issue:** The Phone input (`ContactForm.tsx:51`) is a bare `<input name="phone" className={inputClass} />` with no `type` (defaults to `text`), and the Travel date input has `type="date"` but no `min` attribute.
- **Why it's a problem:** Without `type="tel"`, mobile users get the full alphanumeric keyboard instead of a numeric keypad for what is obviously a phone number field. Without a `min` date, a user could accidentally submit an enquiry with a travel date in the past.
- **Recommended improvement:** Add `type="tel"` (and optionally `inputMode="tel"`) to the phone field, and `min={new Date().toISOString().split('T')[0]}` to the travel-date field.
- **Expected UI/UX behavior:** Mobile keyboards adapt to the field type; the date picker prevents selecting a past date.
- **Affected page/component:** `components/public/ContactForm.tsx`.
- **Priority:** Medium

#### L-6: Contact page has no direct contact info, map, or trust signals alongside the form
- **Issue:** `app/(public)/contact/page.tsx` renders only a heading, one line of copy, and the form — no phone/email/address (even though `SiteSettings` already stores `contactPhone`/`contactEmail`/`address`, used in the footer), no map embed, no response-time expectation.
- **Why it's a problem:** Some users prefer to call/email directly rather than fill out a form, and the page as-is makes that harder than it needs to be given the data already exists in the system.
- **Recommended improvement:** Add a small "Prefer to talk?" panel next to/below the form surfacing phone, email, and address from `SiteSettings`.
- **Expected UI/UX behavior:** Direct contact info is visible on the Contact page itself, not only in the footer.
- **Affected page/component:** `app/(public)/contact/page.tsx`.
- **Priority:** Low

---

## 5. Admin Panel — Area by Area

### 5.1 Layout & Navigation (`app/admin/layout.tsx`, `components/admin/Sidebar.tsx`)

#### H-3-admin: No active-page indicator in the sidebar
*(Same root cause and fix as [H-3](#h-3-no-active-page-indicator-in-the-header-nav), listed separately because it's a distinct component with 20+ links across 6 groups — arguably more important here than on the public header, since the admin sidebar is used for many short, repetitive navigation actions per session.)*
- **Issue:** `Sidebar.tsx` renders every link with the identical static class, with no `usePathname()` comparison or `aria-current`.
- **Why it's a problem:** With 6 groups and ~19 links, losing track of "which screen am I actually on" is a real, frequent cost during normal CMS work (e.g., after following a "Preview" link and hitting Back).
- **Recommended improvement:** Convert `Sidebar` to a Client Component (or a small client sub-part) using `usePathname()` to apply an active background/text style + `aria-current="page"` to the current link.
- **Expected UI/UX behavior:** The link for the section you're currently in is visually distinct from the rest of the sidebar at all times.
- **Affected page/component:** `components/admin/Sidebar.tsx`.
- **Priority:** High

#### M-12: Two differently-labeled sidebar links point to the same URL
- **Issue:** In `Sidebar.tsx`'s `groups` array, "Footer" (under Website) and "Settings" (under SEO & Settings) both link to `href: "/admin/settings"`.
- **Why it's a problem:** An admin clicking "Footer" expecting a footer-specific editor lands on the general Site Settings page instead (which does contain contact/social info the footer uses, but nothing footer-navigation-specific like the `Footer.tsx` component's `columns` structure, which isn't editable anywhere in the admin at all). This is confusing IA — two labels implying two destinations that turn out to be one, and neither one is actually about footer *link* configuration.
- **Recommended improvement:** Either build the actual footer-links editor the "Footer" label implies, or remove the duplicate "Footer" entry and let "Settings" (Site Settings page) be reached once, appropriately labeled.
- **Expected UI/UX behavior:** Every sidebar link goes to a distinct screen matching its label.
- **Affected page/component:** `components/admin/Sidebar.tsx`.
- **Priority:** Medium

#### M-13: Admin sidebar has no responsive/collapse behavior
- **Issue:** `Sidebar.tsx` renders as a fixed `w-64` (256px) column inside a `flex` layout with no breakpoint handling, no collapse toggle, and no `overflow` safeguard for the main content area.
- **Why it's a problem:** On a tablet-width screen (or a laptop with a narrow browser window/devtools open), the fixed sidebar eats a large fraction of the viewport with no way to collapse it, and admin tables (which are already wide, e.g., Enquiries with 5 columns) will feel cramped.
- **Recommended improvement:** Add a collapse-to-icons toggle or an off-canvas pattern below a chosen breakpoint (this doesn't need to be as fully mobile-first as the public site — admin tools are reasonably desktop-first — but a tablet/narrow-desktop accommodation is worth adding).
- **Expected UI/UX behavior:** The admin panel remains usable on tablet-width and narrow-desktop screens without table content getting cramped.
- **Affected page/component:** `app/admin/layout.tsx`, `components/admin/Sidebar.tsx`.
- **Priority:** Medium

#### L-7: Admin top bar is missing the search/avatar the design spec describes
- **Issue:** `DESIGN-SPEC.md` describes the admin top bar as "page title, search, avatar." The actual implementation (`app/admin/layout.tsx:16-18`) only shows "Signed in as {email}" as plain text — no page title, no search, no avatar/profile menu.
- **Why it's a problem:** Minor on its own, but it means there's no quick way to jump to a specific piece of content by name from anywhere in the admin, and no discoverable path to account-related actions beyond the sidebar's plain-text "Log out" button.
- **Recommended improvement:** At minimum, add a dynamic page title in the top bar (many admin pages already duplicate their own `<h1>`, so this could just mirror that); a global content search is a larger feature to schedule separately.
- **Expected UI/UX behavior:** The top bar reflects the current section and offers quick wayfinding, per the original design intent.
- **Affected page/component:** `app/admin/layout.tsx`.
- **Priority:** Low

---

### 5.2 Login (`app/admin/login/page.tsx`, `components/admin/LoginForm.tsx`)

This screen is simple and works well — centered card, brand logo, clear labels, `autoComplete` attributes set correctly (`email`, `current-password`), disabled+relabeled submit button while pending. No structural issues beyond the site-wide focus-state gap (H-2). One small note:

#### L-8: No "forgot password" path
- **Issue:** `LoginForm` has no password-reset link or flow, and per `REQUIREMENTS.md` there's intentionally no self-service registration — but password recovery for a single admin account isn't addressed either.
- **Why it's a problem:** If the one admin account's password is lost, there's no documented in-product recovery path (presumably a CLI script per Phase 9's checklist, but nothing surfaced in the UI).
- **Recommended improvement:** At minimum, add a short line of copy ("Lost your password? Contact your developer / run the reset script") so it's not a dead end with zero guidance.
- **Expected UI/UX behavior:** A locked-out admin has a documented next step, even if it's not a full self-service flow.
- **Affected page/component:** `app/admin/login/page.tsx`.
- **Priority:** Low

---

### 5.3 Dashboard (`app/admin/page.tsx`, `components/admin/StatTile.tsx`)

#### H-8: "Published"/"Drafts" stat tiles and "Recent Content" only reflect Destinations, not the whole site
- **Issue:** `getDashboardData()` in `app/admin/page.tsx:8-36` computes `publishedCount`/`draftCount` exclusively from `prisma.destination.count({ where: { status: ... } })`, and `recentDestinations` (labeled "Recent Content" in the UI) is exclusively `prisma.destination.findMany(...)`. Meanwhile the "Destinations", "Packages", and "Blog Posts" tiles do correctly show their own per-module totals.
- **Why it's a problem:** A tile simply labeled "Published" and "Drafts" (with no "(Destinations)" qualifier) strongly implies a site-wide count, and a panel titled "Recent Content" strongly implies recently-edited content of any type — as built, both silently ignore Packages, Places, Blogs, Guides, and Activities entirely. An admin managing a Package or Blog-heavy site would see numbers that don't reflect their actual workload at all, which is actively misleading rather than just incomplete.
- **Recommended improvement:** Either compute `publishedCount`/`draftCount` and "recent content" across all content tables (straightforward with a few more `Promise.all` queries, or one aggregate query per the architecture doc's own suggestion of "cheap aggregate queries, no charting library needed"), or relabel the tiles/panel to be explicit about scope (e.g., "Destinations — Published").
- **Expected UI/UX behavior:** Dashboard numbers and the "Recent Content" list reflect the whole site, matching what their labels claim, or are explicitly scoped in their labels if they don't.
- **Affected page/component:** `app/admin/page.tsx`.
- **Priority:** High

#### L-9: Stat tiles have no click-through
- **Issue:** `StatTile` (`components/admin/StatTile.tsx`) renders a static, non-interactive card — clicking "Packages: 12" does nothing.
- **Why it's a problem:** A very common and expected dashboard pattern is that a stat tile links to the filtered list it's summarizing (e.g., clicking "Drafts" jumps to the content list pre-filtered to drafts) — small missed efficiency win, more relevant once H-8 and the list-filtering gaps (see H-9) are addressed.
- **Recommended improvement:** Wrap tiles in a `Link` to the relevant list page/filter once list-page filtering exists.
- **Expected UI/UX behavior:** Clicking a stat tile takes you to the underlying filtered list.
- **Affected page/component:** `components/admin/StatTile.tsx`.
- **Priority:** Low

---

### 5.4 Content List Pages (Destinations, Places, Packages, Blog, Guides, Activities, Categories, Navigation, FAQs, Testimonials, Media)

These pages (e.g., `app/admin/destinations/page.tsx`, `app/admin/enquiries/page.tsx`, and the equivalent list pages for every other module) share one consistent table pattern: header row + "New" button, a table with a status/action column, `StatusBadge`, a "Preview" link that opens the live public page in a new tab, an "Edit" link, and a `ConfirmSubmitButton` delete. This consistency across ~10 modules is a real strength (see [Section 6](#6-whats-already-good--do-not-change)) — the issues below are about what's *missing* from the pattern, not the pattern itself.

#### H-9: No search, filter, sort, or pagination on any admin content list
- **Issue:** Every list page (`listAll()` calls in `lib/db/*.ts` consumed directly by e.g. `app/admin/destinations/page.tsx:10`) fetches and renders the **entire** table with no `take`/`skip`, no query-param filtering, and no client-side search box — confirmed across Destinations, Places, Packages, Blog, Guides, Activities, Media, Categories, Navigation, FAQs, and Testimonials.
- **Why it's a problem:** `REQUIREMENTS.md`'s own Phase 5 explicitly scopes this ("server-paginated table... search box, status/category filters, bulk publish/unpublish/delete") as a core part of the generic CMS pattern — it wasn't built. This works fine with a handful of seed rows, but becomes unusable once real content volume grows (a single long unpaginated table with no search is a common cause of admin-tool abandonment).
- **Recommended improvement:** Add, at minimum: a text search box filtering by name/title, a status filter dropdown (Draft/Published), and pagination once any table is likely to exceed ~30-50 rows. Bulk actions (multi-select + bulk publish/unpublish/delete) can follow once search/filter/pagination exist.
- **Expected UI/UX behavior:** An admin managing hundreds of destinations/packages can find and act on a specific item without scrolling an endless table.
- **Affected page/component:** All admin list pages under `app/admin/**/page.tsx`.
- **Priority:** High

#### H-10: FAQs, Testimonials, Categories, and Navigation items can be created and deleted, but never edited
- **Issue:** `FaqForm`, `TestimonialForm`, `CategoryForm`, and `NavigationItemForm` are all wired only to their respective `create*Action` — there is no corresponding edit form, no `[id]` edit route, and their list pages (`app/admin/faqs/page.tsx`, `testimonials/page.tsx`, `categories/page.tsx`, `navigation/page.tsx`) render only "Delete" as a row action, never "Edit".
- **Why it's a problem:** Fixing a single typo in a testimonial quote, an FAQ answer, a category name, or a nav link URL currently requires **deleting and recreating** the item — which for Categories and Navigation items also means losing any relations/nesting (a category re-created with a new ID would need every Package/Blog/Activity that referenced it to be re-tagged; a re-created nav parent breaks any children pointing at the old `parentId`).
- **Recommended improvement:** Add edit capability (either a dedicated `[id]/page.tsx` per module, matching the pattern already used for Destinations/Packages/etc., or an inline-edit-in-table pattern for these simpler, single-field-heavy models).
- **Expected UI/UX behavior:** Every piece of content in the admin, without exception, can be corrected in place without being destroyed and recreated.
- **Affected page/component:** `components/admin/FaqForm.tsx`, `TestimonialForm.tsx`, `CategoryForm.tsx`, `NavigationItemForm.tsx` and their respective admin pages.
- **Priority:** High

#### M-14: Category/Tag entry on Blog posts is free-text, inviting duplicates
- **Issue:** `BlogForm`'s Categories and Tags fields (`components/admin/BlogForm.tsx:83-96`) are plain comma-separated text inputs, not a picker against the existing `blog_categories`/`blog_tags` tables.
- **Why it's a problem:** Nothing stops an editor from typing "Trekking" on one post and "trekking" or "Treking" on the next, silently fragmenting what should be one category/tag across several near-duplicates, which then shows up as separate, confusing filter options on the public `/blog/category/[slug]` and `/blog/tag/[slug]` pages.
- **Recommended improvement:** Replace with an autocomplete/multi-select against existing categories and tags (allowing "create new" inline for genuinely new ones), similar to the checkbox pattern already used for Package categories in `PackageForm`.
- **Expected UI/UX behavior:** Typing an existing category/tag name suggests and reuses it instead of silently creating a near-duplicate.
- **Affected page/component:** `components/admin/BlogForm.tsx`.
- **Priority:** Medium

#### M-15: FAQ "Context ID" is a raw text field expecting a pasted UUID
- **Issue:** `FaqForm.tsx:30-32` — when a non-Global context (Package/Destination/Guide) is chosen, the admin must manually type or paste the target record's raw ID into a plain text input with placeholder text `"Package/Destination/Guide id"`.
- **Why it's a problem:** This requires the admin to already know or go look up a UUID from elsewhere (there's no dropdown, no search) — a highly error-prone manual-data-entry step for linking an FAQ to a specific piece of content, in an app that otherwise consistently uses `<select>` dropdowns of names for every other relation (Destination pickers, Package pickers, etc.).
- **Recommended improvement:** Replace the raw ID text field with a `<select>` populated from the chosen context type (mirroring the `destinationId`/`categoryIds` pickers used elsewhere in the same codebase).
- **Expected UI/UX behavior:** Linking an FAQ to a specific package/destination/guide is a dropdown selection by name, not a pasted ID.
- **Affected page/component:** `components/admin/FaqForm.tsx`.
- **Priority:** Medium

#### L-10: No "Cancel"/"Back to list" affordance on any create/edit form
- **Issue:** Every content form (`DestinationForm`, `PackageForm`, `BlogForm`, etc.) shows only a single "Save"/submit button — there's no secondary "Cancel" link back to the list.
- **Why it's a problem:** Minor, but an admin who opens a create form and changes their mind has to rely on the sidebar or browser Back rather than an explicit, obvious way out.
- **Recommended improvement:** Add a plain "Cancel" text link next to the Save button, linking back to the module's list page.
- **Expected UI/UX behavior:** Every form has both a clear way to save and a clear way to back out.
- **Affected page/component:** All admin form components.
- **Priority:** Low

---

### 5.5 Content Forms — Images (`components/admin/MediaPicker.tsx` vs. `components/admin/GalleryForm.tsx`)

#### H-11: The single-image picker is a plain text dropdown; the app already has a better pattern it doesn't reuse
- **Issue:** `MediaPicker` (used for the cover image on Destination, Package, Place, and Activity forms) is a bare `<select>` listing `item.title || item.altText || item.id}` as plain text options — no thumbnail, no preview of the selected image anywhere in the form. Meanwhile, `GalleryForm` (used for photo albums) implements exactly the right pattern just a few files away: a `grid grid-cols-3 sm:grid-cols-4` of actual image thumbnails with a checkbox overlay and a `ring-2 ring-navy` selected-state.
- **Why it's a problem:** Choosing a cover image by reading a list of filenames/titles (which are often auto-generated or missing) with no visual confirmation is genuinely hard to use correctly, especially once the media library has more than a handful of images — and it's a worse experience than a pattern the codebase has *already built and proven* one file away. This is the single clearest "inconsistent component" finding in the audit.
- **Recommended improvement:** Rebuild `MediaPicker` as a single-select variant of the same thumbnail-grid pattern used in `GalleryForm` (or better, a proper modal "media library picker" reusable across all single-image fields, as `REQUIREMENTS.md` Phase 8 specifies: "a picker mode reused by every content form's image fields").
- **Expected UI/UX behavior:** Picking a cover image shows actual thumbnails to choose from, with the currently-selected image visibly indicated in the form.
- **Affected page/component:** `components/admin/MediaPicker.tsx` (used in `DestinationForm`, `PackageForm`, `PlaceForm`, `ActivityForm`, `BlogForm`).
- **Priority:** High

---

### 5.6 Media Library (`app/admin/media/page.tsx`, `components/admin/MediaUploadForm.tsx`)

This screen is otherwise solid: a proper thumbnail grid, required alt-text enforced on upload (matching the accessibility/SEO requirement from `REQUIREMENTS.md` Phase 8), a clear upload form with file/alt-text/title fields, disabled+relabeled submit while pending, and the form resets after a successful upload. A few gaps:

#### M-16: No way to edit an image's alt text or title after upload
- **Issue:** `deleteMediaAction` exists; no `updateMediaAction`/edit form exists anywhere in `components/admin/` or `lib/db/media-actions.ts`'s consumers.
- **Why it's a problem:** If an admin notices a typo in alt text (which is required and directly affects accessibility/SEO — the exact thing it exists to protect), the only fix is deleting the image and re-uploading it, which breaks every existing reference to that image across the site.
- **Recommended improvement:** Add a small inline-edit (click alt text to edit) or an edit modal per media item.
- **Expected UI/UX behavior:** Alt text and title can be corrected without re-uploading and breaking existing references.
- **Affected page/component:** `app/admin/media/page.tsx`.
- **Priority:** Medium

#### L-11: No search/filter and no "copy URL"/usage indicator in the Media Library
- **Issue:** All media renders in one unpaginated, unfiltered grid; there's no way to see which pages currently use a given image, and no quick "copy URL" action.
- **Why it's a problem:** Same growth-scaling concern as H-9, specific to media; also, "Delete this image? Pages using it will lose the reference" (the confirm message itself) implies the risk of dangling references but the UI gives no way to check usage before deleting.
- **Recommended improvement:** Add search-by-alt-text/title once the library grows, and consider showing reference counts if feasible.
- **Expected UI/UX behavior:** An admin can find a specific image quickly and understands the blast radius before deleting one.
- **Affected page/component:** `app/admin/media/page.tsx`.
- **Priority:** Low

---

### 5.7 Enquiries (`app/admin/enquiries/page.tsx`, `components/admin/EnquiryStatusSelect.tsx`)

This is one of the better-executed admin screens: status can be changed inline via a `<select>` wired to `useTransition` (no full page reload, disabled while pending), contact info is grouped sensibly, and "Interested in" cleanly falls back from package → destination → "General enquiry". One gap:

#### M-17: No filter by status, and no way to view an enquiry's full message/notes without... there's nowhere to view it at all
- **Issue:** The table shows Contact, Interested in, Received date, Status, and Delete — but the `enquiry.message` and `admin_notes` fields (present in the schema per `REQUIREMENTS.md`) are never rendered anywhere in the admin UI at all, not even behind a click-to-expand.
- **Why it's a problem:** The actual free-text message a lead wrote — arguably the most important single piece of information in an enquiry — is invisible in the admin panel. An admin has to go to the database directly to read what a prospective customer actually asked. This is a significant functional gap dressed as a UI omission (the data is being collected, just never shown).
- **Recommended improvement:** Add a click-to-expand row (or a dedicated detail view) showing the full message and an editable admin-notes field, and add a status filter dropdown above the table.
- **Expected UI/UX behavior:** Clicking an enquiry row reveals the full message the customer wrote, and admins can filter the list by status (e.g., to see only "New" leads).
- **Affected page/component:** `app/admin/enquiries/page.tsx`.
- **Priority:** High *(elevated from Medium — this blocks a core piece of the admin's actual job, not just a convenience)*

---

### 5.8 Homepage Sections, SEO, Settings (`HomepageSectionsForm.tsx`, `SeoSettingsForm.tsx`, `SettingsForm.tsx`)

These three are simple, well-scoped forms and work cleanly: checkboxes with clear labels for homepage section toggles, grouped sections with headers in Settings, "Saved." confirmation text on success. No structural issues found beyond the site-wide ones (M-1 required-field indicators, H-2 focus states).

#### L-12: "Saved." confirmation text has no auto-dismiss and minimal visual weight
- **Issue:** `{state.success && <p className="text-sm text-navy">Saved.</p>}` in `HomepageSectionsForm`/`SeoSettingsForm`/`SettingsForm` persists indefinitely (until the next submit) as a small text line with no icon, and doesn't clearly separate "success" from body text visually.
- **Why it's a problem:** Very minor — an admin might not notice a small navy-colored word appeared, especially if the button is off-screen after a long form scroll.
- **Recommended improvement:** Consider a small toast/snackbar pattern shared across all three forms, or at least add a checkmark icon and slightly more visual weight.
- **Expected UI/UX behavior:** A save confirmation is clearly noticeable regardless of scroll position.
- **Affected page/component:** `HomepageSectionsForm.tsx`, `SeoSettingsForm.tsx`, `SettingsForm.tsx`.
- **Priority:** Low

---

## 6. What's Already Good — Do Not Change

It's worth explicitly protecting these from well-intentioned "improvement" during future work, since they're already doing their job:

1. **Design token architecture** (`app/globals.css`) — a single source of truth for color via CSS variables consumed through Tailwind's `@theme inline`, matching `DESIGN-SPEC.md` exactly. Extend it, don't restructure it.
2. **Font loading strategy** — `Fraunces`/`Work Sans` via `next/font/google` with explicit weight arrays in `app/layout.tsx`. Correct, CLS-safe, matches the spec's explicit instruction to avoid a runtime `<link>` tag.
3. **`DestinationCard`/`BlogCard` components** — clean, consistent `rounded-xl border` treatment, subtle `hover:shadow-lg` + image `scale-105` on hover, `line-clamp-2` for descriptions, sensible placeholder fallback when no image exists. This is the right shape for every other card type to converge on (see M-5, M-6).
4. **Empty states, everywhere** — every single listing page (public and admin) has a real empty state with helpful copy instead of a blank grid, and several public ones smartly link straight to `/admin` when there's no content yet ("No destinations published yet — add some from the admin panel"). This is a genuinely good touch for a freshly-deployed instance and should be the template for any new listing page added later.
5. **FAQ accordions via native `<details>`/`<summary>`** (homepage and package detail) — zero JavaScript, fully keyboard-operable, semantically correct out of the box. Don't replace this with a custom JS accordion component without a real reason to.
6. **`StatusBadge` semantic color system** — the exact navy/orange/blue-gray/gray mapping specified in `DESIGN-SPEC.md`, applied identically across the Dashboard, every content list, and Enquiries. Fully consistent, no drift found anywhere it's used.
7. **Structured data coverage** — `StructuredData` + `lib/seo/schema.ts` correctly emit `TouristDestination`, `TouristAttraction`, `TouristTrip`, `Article`, `BreadcrumbList`, and a conditionally-emitted `FAQPage` (only when real FAQ content exists, exactly as `REQUIREMENTS.md` Phase 6 specifies) — a strong, correctly-scoped technical SEO foundation that isn't a "UI" feature per se but directly supports the product's SEO goals.
8. **Consistent `useActionState` + `isPending` pattern** — every single form in the app (public and admin, ~20 forms) disables its submit button and swaps the label to a "…ing" verb while pending, with server-driven field-level error messages. This is applied with zero exceptions found anywhere in the codebase — a genuinely disciplined, consistent baseline.
9. **Slug auto-generation with manual-override detection** (`slugTouched` state in every content form with a slug field) — typing a name auto-fills a matching slug, but the moment a user edits the slug field directly, auto-sync stops so their manual edit is never clobbered. A small but well-thought-out interaction detail, present identically in `DestinationForm`, `PackageForm`, `BlogForm`, `GalleryForm`, and `CategoryForm`.
10. **Pill-shaped primary actions vs. 8px-radius inputs** — the shape language from the design spec ("Buttons: pill-shaped... for primary/secondary CTAs; 8px radius for form inputs") is applied with no exceptions found across the entire codebase.
11. **Honeypot spam field on the public contact form** — a sensible, low-friction first line of defense on the site's one unauthenticated write path (aside from the positioning bug noted in M-9, the technique itself is sound and shouldn't be removed).

---

## 7. Priority Index

Quick-reference list of every numbered finding, for planning/ticketing purposes.

### Critical
| ID | Issue | Page/Component |
| --- | --- | --- |
| C-1 | No mobile navigation menu | `Header.tsx` (site-wide) |
| C-2 | No loading/error/not-found states anywhere | Entire app |
| C-3 | Hero "search" box is a non-functional decoy | Homepage |
| C-4 | "Save" button on destination page does nothing | Destination detail |

### High
| ID | Issue | Page/Component |
| --- | --- | --- |
| H-1 | Zero ARIA attributes in the codebase | Site-wide |
| H-2 | Focus states nearly invisible (no focus rings anywhere) | Site-wide |
| H-3 | No active-page indicator in header nav | `Header.tsx` |
| H-3-admin | No active-page indicator in admin sidebar | `Sidebar.tsx` |
| H-4 | Detail-page sidebars aren't actually sticky | Destination & Package detail |
| H-5 | Package booking sidebar missing date/traveller/WhatsApp | Package detail |
| H-6 | No rich text editing/rendering for blog/guide content | `BlogForm`, blog/guide pages |
| H-7 | Gallery has no lightbox/zoom | Gallery pages |
| H-8 | Dashboard "Published/Drafts"/"Recent Content" only reflect Destinations | Admin Dashboard |
| H-9 | No search/filter/pagination on any admin list | All admin list pages |
| H-10 | FAQs/Testimonials/Categories/Nav items can't be edited, only deleted | 4 admin forms |
| H-11 | Cover-image picker is a text dropdown, not the thumbnail grid the app already has | `MediaPicker.tsx` |
| H-12 | Enquiry message/notes are never shown in the admin UI | Admin Enquiries |

### Medium
| ID | Issue | Page/Component |
| --- | --- | --- |
| M-1 | No visual indicator for required fields | All forms |
| M-2 | No hover feedback on admin table rows | All admin tables |
| M-3 *(→Low)* | Native `window.confirm()` for all deletes | `ConfirmSubmitButton.tsx` |
| M-4 | Two footer links point to the same URL | `Footer.tsx` |
| M-5 | Package card markup duplicated instead of shared component | Homepage, `/packages` |
| M-6 | Place cards show no imagery, inconsistent with other cards | `/places` |
| M-7 | Enquire CTAs never pass destination/package context to contact form | Multiple detail pages |
| M-8 | Article pages lack related content/share/author avatar | Blog/Guide detail |
| M-9 | Honeypot field absolutely positioned without relative container | `ContactForm.tsx` |
| M-10 | Phone field lacks `type="tel"`; date field lacks `min` | `ContactForm.tsx` |
| M-12 | Two sidebar labels ("Footer", "Settings") link to the same page | `Sidebar.tsx` |
| M-13 | Admin sidebar has no responsive/collapse behavior | Admin layout |
| M-14 | Blog category/tag entry is free-text, invites duplicates | `BlogForm.tsx` |
| M-15 | FAQ context linking requires pasting a raw ID | `FaqForm.tsx` |
| M-16 | No way to edit image alt text/title after upload | Media Library |
| M-17 *(→High)* | See H-12 above (reclassified) | — |

### Low
| ID | Issue | Page/Component |
| --- | --- | --- |
| L-1 | Social links are plain text, no icons | `Footer.tsx` |
| L-2 | CTA band reuses "draft" status color token | Homepage |
| L-3 | Package photo blocks have no lightbox plan | Package detail |
| L-4 | Difficulty badge has no severity color-coding | Activity detail |
| L-5 | Blog category chip reuses "draft" status color token | Blog post |
| L-6 | Contact page has no direct info/map alongside the form | Contact page |
| L-7 | Admin top bar missing page title/search/avatar | Admin layout |
| L-8 | No "forgot password" guidance on login | Admin login |
| L-9 | Stat tiles aren't clickable through to filtered lists | Admin Dashboard |
| L-10 | No Cancel/Back link on create/edit forms | All admin forms |
| L-11 | No search/usage-indicator in Media Library | Media Library |
| L-12 | "Saved." confirmation has low visual weight, no auto-dismiss | Settings/SEO/Homepage forms |

*(M-11 "No icon system" is discussed in [Section 2.4](#24-iconography) as a foundational note rather than a single actionable ticket — treat it as context for L-1, and for the C-1 mobile-menu icon that will be needed.)*

---

**Total findings:** 4 Critical, 13 High, 15 Medium, 12 Low, plus 11 explicitly-protected "good" patterns.

This audit is a snapshot as of the current codebase state and should be re-run (or spot-checked against this list) after the Critical and High items are addressed, since several Medium/Low items reference or depend on them (e.g., L-9's dashboard click-through depends on H-9's list filtering; M-7's context-passing depends on H-5's booking-sidebar rebuild).
