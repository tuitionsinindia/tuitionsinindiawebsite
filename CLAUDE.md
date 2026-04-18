# TuitionsInIndia — Project Guidelines

## Design System & Branding

### Brand Identity
- **Name**: TuitionsInIndia (written as "TuitionsinIndia" in UI — note the lowercase "in")
- **Logo**: Blue rounded square with GraduationCap icon + "TuitionsinIndia" text
- **Primary color**: Blue-600 (#2563EB)
- **Target audience**: Indian students, parents, and tutors. All copy must be simple, clear, and easy to understand.

### Design Rules (STRICT — never break these)

**Typography:**
- Use `font-semibold` or `font-bold` for headings. NEVER use `font-black`.
- Use `tracking-tight` at most. NEVER use `tracking-widest`, `tracking-[0.3em]`, `tracking-[0.4em]`, etc.
- NEVER use `italic` on labels, buttons, or headings.
- NEVER use `uppercase` on body text, labels, or descriptions. Only acceptable on very small badges.
- Use normal sentence-case for all text. No ALL-CAPS labels.

**Colors & Theme:**
- The site is LIGHT MODE only. White backgrounds, gray borders, blue accents.
- NEVER use dark theme CSS: `bg-background-dark`, `bg-surface-dark`, `border-border-dark`, `text-on-surface-dark`, `text-on-primary`, or any CSS variable like `--background-dark`.
- NEVER use `text-white/40`, `text-white/20`, etc. on light backgrounds.

**Border Radius:**
- Use `rounded-lg`, `rounded-xl`, `rounded-2xl` max. NEVER use `rounded-[3rem]`, `rounded-[2.5rem]`, or any extreme values.

**Spacing:**
- Standard padding: `p-4`, `p-5`, `p-6`. NEVER use `p-10`, `p-12`, `p-14` on cards.
- Standard gaps: `gap-2`, `gap-3`, `gap-4`. NEVER use `gap-8`, `gap-10`, `gap-12` between form fields.

**Language & Copy (CRITICAL):**
- NEVER use jargon, technical terms, or sci-fi language. The site is for students and parents in India.
- Banned words: Protocol, Terminal, Matrix, Node, Faculty, Scholar, Mandate, Sync, Initialize, Deploy, Execute, Commit, Calibrate, Tactical, Vector, Aura, Neural, Geospatial, Radar, Vault, Crypt, Cipher, Institutional, Pedagogical, Coefficient, Override, Intercept, Hub (when used as jargon)
- Use instead: Tutor (not Faculty), Student (not Scholar), Requirement (not Mandate), Dashboard (not Terminal), Settings (not Protocol), Step (not Phase/Calibration)
- Button labels: "Save", "Submit", "Next", "Continue", "Sign Up", "Log In", "Contact Tutor", "View Profile"
- Error messages: Plain English like "Please try again" not "SYNC_ERROR: RE-INITIALIZE_CONNECTION"

### Component Patterns

**Header**: Simple nav with Logo + 3 links + "Log In" + "Sign Up Free". No admin link in public header.

**Search cards**: White card, tutor name, subject badge, location, rate, rating stars, "Contact Tutor" + "View Profile" buttons.

**Forms**: White background, gray-50 inputs, blue-600 primary buttons, simple labels in sentence case.

**Dashboards**: White sidebar with icon nav, main content area with metric cards + data sections.

## Tech Stack
- Next.js 15.2.9 (App Router)
- Prisma ORM + PostgreSQL
- Tailwind CSS
- Razorpay for payments
- Resend for email, Twilio for SMS
- Deployed via Docker on Hostinger VPS (187.77.188.36)

## Git Workflow
- Main branch: `main` — always deployable
- Work in worktrees via `.claude/worktrees/`
- Deploy: `./deploy.sh` (rsync + docker rebuild)
- Database: `prisma db push` (not migrate)
- NEVER use `git checkout --theirs` on bulk merge conflicts — review each file individually

## Key Directories
- `app/` — Next.js pages and API routes
- `app/components/` — Shared UI components
- `app/dashboard/` — Role-based dashboards (student, tutor, institute, admin)
- `lib/` — Utilities (session, email, notifications, matchEngine, rateLimit)
- `prisma/schema.prisma` — Database schema

## Business Model
- FREE users: Can post profiles/requirements, receive enquiries. 0 credits. Cannot initiate contact.
- Credits: Buy packs (₹99/₹249/₹449) to unlock student contacts.
- PRO: ₹699/month — 30 credits, verified badge, priority search.
- ELITE: ₹2,499/month — 100 credits, unlimited, featured listing.
- Featured listing: ₹199/week or ₹499/month.
- Lead boost: ₹49 per requirement.
- Zero commission on tutor fees.
