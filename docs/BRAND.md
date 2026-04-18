# TuitionsInIndia — Brand Guidelines

## Brand Identity

- **Product name**: TuitionsInIndia
- **UI display name**: TuitionsinIndia (lowercase "in")
- **Tagline**: Find the right tutor, near you
- **Mission**: Make quality private tutoring accessible to every student in India
- **Tone**: Friendly, trustworthy, simple — like a helpful older sibling, not a corporation

---

## Logo

- Blue rounded square (`bg-blue-600 rounded-xl`) + GraduationCap icon (Lucide) in white
- Brand name "TuitionsinIndia" in `font-semibold text-blue-600` beside the icon
- Never distort, recolour, or add effects to the logo

---

## Colour Palette

| Role | Tailwind class | Hex |
|---|---|---|
| Primary | `blue-600` | `#2563EB` |
| Primary hover | `blue-700` | `#1D4ED8` |
| Background | `white` | `#FFFFFF` |
| Surface | `gray-50` | `#F9FAFB` |
| Border | `gray-200` | `#E5E7EB` |
| Body text | `gray-900` | `#111827` |
| Secondary text | `gray-600` | `#4B5563` |
| Muted text | `gray-400` | `#9CA3AF` |
| Success | `green-600` | `#16A34A` |
| Error | `red-600` | `#DC2626` |
| Warning | `yellow-500` | `#EAB308` |

**Never use**: dark backgrounds, dark theme CSS variables (`bg-background-dark`, `text-on-surface-dark`, etc.), or `text-white/40` on light backgrounds.

---

## Typography

| Use | Class |
|---|---|
| Page heading (H1) | `text-3xl font-bold tracking-tight` |
| Section heading (H2) | `text-2xl font-semibold` |
| Card heading | `text-lg font-semibold` |
| Body | `text-base text-gray-700` |
| Small / caption | `text-sm text-gray-500` |
| Badge | `text-xs font-medium` |

**Rules:**
- `font-semibold` or `font-bold` for headings — NEVER `font-black`
- `tracking-tight` at most — NEVER `tracking-widest` or custom `tracking-[0.3em]`
- Sentence-case for all text — NEVER ALL-CAPS labels or headings
- NEVER use `italic` on labels, buttons, or headings

---

## Banned Words & Jargon

These words must NEVER appear in UI copy, button labels, headings, or error messages:

> Protocol, Terminal, Matrix, Node, Faculty, Scholar, Mandate, Sync, Initialize, Deploy, Execute, Commit, Calibrate, Tactical, Vector, Aura, Neural, Geospatial, Radar, Vault, Crypt, Cipher, Institutional, Pedagogical, Coefficient, Override, Intercept, Hub (as jargon)

**Use instead:**

| Avoid | Use |
|---|---|
| Faculty | Tutor |
| Scholar | Student |
| Mandate | Requirement |
| Terminal | Dashboard |
| Protocol | Settings |
| Phase / Calibration | Step |
| Sync | Save / Update |
| Initialize | Start / Set up |

---

## Voice & Tone

- **Simple**: Write at a Grade 8 reading level. Avoid long sentences.
- **Warm**: "We're here to help you find the right tutor" — not "Our platform facilitates tutor-student matching."
- **Encouraging**: Celebrate progress ("Your listing is live!"), don't lecture.
- **Indian context**: Mention subjects (Maths, Science, English), board exams (CBSE, ICSE, IIT-JEE), and city names naturally.

---

## Button Labels

| Action | Label |
|---|---|
| Primary action | "Save", "Submit", "Continue", "Next" |
| Registration | "Sign Up Free", "Create Account" |
| Login | "Log In" |
| Contact | "Contact Tutor", "Send Message" |
| View | "View Profile", "See More" |
| Cancel | "Cancel", "Go Back" |

---

## Component Style Rules

| Component | Rules |
|---|---|
| Cards | `bg-white rounded-xl border border-gray-200 p-5` |
| Input fields | `bg-gray-50 border border-gray-300 rounded-lg px-3 py-2` |
| Primary button | `bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium` |
| Secondary button | `border border-gray-300 text-gray-700 rounded-lg px-4 py-2` |
| Badges | `bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full` |

**Border radius**: `rounded-lg`, `rounded-xl`, `rounded-2xl` max — NEVER `rounded-[3rem]` or extreme values.

**Padding**: `p-4`, `p-5`, `p-6` on cards — NEVER `p-10`, `p-12`, `p-14`.

---

## Target Audience

1. **Students / Parents** — looking for tutors for school subjects, competitive exams, or hobby classes. Want trust signals (ratings, verified badge, location).
2. **Tutors** — want more students. Care about profile visibility and zero commission.
3. **Institutes** — coaching centres or academies wanting to list their teachers and reach more students.

---

## SEO Copy Notes

- Page titles: `[Topic] | TuitionsInIndia` (e.g., "Find Maths Tutors in Mumbai | TuitionsInIndia")
- Meta descriptions: Under 160 chars, include target keyword + location when relevant
- Structured data: Tutor profiles use `Person` JSON-LD; blog posts use `Article` JSON-LD
