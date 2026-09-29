# PRD — Maison de Tresse (Women's Hair Braiding Business Website)

## Original Problem Statement
"create a website for business that does braiding hair for woman."
User choices (2026-09-15): elegant placeholder content (real business details TBD) · features = gallery of braid styles + services & pricing + booking enquiry form · design vibe = full creative freedom.

## Product
Award-worthy, editorial one-page marketing site for a luxury women's braid atelier ("Maison de Tresse" — placeholder brand). Dark espresso/gold aesthetic, Cormorant Garamond + Plus Jakarta Sans + Space Mono, lenis smooth scrolling, framer-motion throughout.

## Architecture
- Frontend: React 19 + Tailwind + framer-motion 11 + lenis (`/app/frontend/src/`)
  - Components: AtelierHeader, KineticHero (masked line reveal + parallax), EditorialMarquee, CraftManifesto (4 numbered chapters), StyleGallery (filters + spotlight modal + book-this-style prefill), ServicesPricing (3 tabs), BookingForm (receipt state + sonner toast), ClientReviews, AtelierFooter (FAQ accordion, WhatsApp CTA)
  - Content data: `/app/frontend/src/data/content.js` (edit this for real business details)
  - Images: `/app/frontend/public/images/` (7 local JPEGs)
- Backend: FastAPI (`/app/backend/server.py`) — `POST /api/bookings`, `GET /api/bookings`, MongoDB via MONGO_URL/DB_NAME, booking references `MDT-XXXXXX`
- No auth (public site); booking list endpoint is unauthenticated (acceptable for MVP)

## User Personas
- Prospective client: browses styles, checks pricing, sends booking enquiry
- Business owner: receives enquiries (MongoDB `bookings` collection), updates content later

## Implemented (2026-09-15)
- Kinetic hero with staggered masked line reveal, parallax portrait, floating badge
- Editorial marquee, 4-chapter manifesto, filterable gallery with modal + service prefill
- Services & pricing matrix (real Hair By Kev prices R150–R500, Braids / Styling & Treatments tabs)
- Booking enquiry form → FastAPI → MongoDB, success receipt with HBK- reference, sonner toast
- 30% deposit step on receipt: WhatsApp deep link with reference + deposit amount prefilled (user choice; Stripe unavailable for ZA — Paystack/Yoco is the upgrade path)
- Client reviews: public review form (modal, star rating) → POST /api/reviews, live reviews displayed before curated ones
- Owner photo uploads: /admin page (passcode gate, OWNER_UPLOAD_CODE env) → object storage (EMERGENT_LLM_KEY) → uploaded photos appear first in public gallery, soft-delete supported
- Showcase replacement: /admin Photos tab lets owner replace each of the six default gallery photos (POST /api/photos/replace/{gallery_id}, photo_overrides collection) with Reset to restore originals; public gallery applies overrides
- Reviews, FAQ accordion, WhatsApp CTA (+27 84 675 1212), full data-testid coverage
- Review moderation: new reviews default to pending and are hidden publicly until approved from /admin (approve/reject, pending count badge)
- Bookings dashboard on /admin: all enquiries with status badges, Confirm / Mark completed / Cancel actions, Message client WhatsApp deep link, new-count badge
- Verified: bookings API, reviews API + moderation chain (pending hidden → approve → public), admin check, photo upload/list/serve, e2e browser flows

## Backlog
- DONE (2026-09-15): Real details applied — Hair By Kev · WhatsApp +27 84 675 1212 (wa.me/27846751212) · Buccleuch, Sandton + house calls · prices R150–R500 · booking refs now HBK-XXXXXX
- P1: WhatsApp notification to owner on new booking (wa.me deep link or Twilio), owner dashboard for bookings
- P1: Email confirmations (Resend)
- P2: Real client photo gallery upload (object storage), availability calendar, deposit payments (Stripe/PayFast)

## Next Tasks
1. Swap placeholder brand/contact for real details
2. Wire owner notifications for new bookings
3. Add booking admin view
