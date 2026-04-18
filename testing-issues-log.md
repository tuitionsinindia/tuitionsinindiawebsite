# TuitionsInIndia — Testing Issues Log
**Date:** 18 April 2026  
**Tested by:** Claude (automated visual scan of all public pages + registration flows)

---

## Issues Found

| # | Issue | Page / Flow | Severity |
|---|-------|-------------|----------|
| 1 | Search card button says **"View Contact"** — design rules require **"Contact Tutor"** | `/search` | Medium |
| 2 | Header logo text "TuitionsinIndia" is nearly invisible (very low contrast against white background). Affects all pages that use the minimal header (no full nav). Confirmed on: `/how-it-works/student`, `/how-it-works/tutor`, `/how-it-works/institute`, `/get-started`, `/pricing/student`, `/pricing/tutor`, `/pricing/institute`, `/register/*` | All minimal-header pages | Medium |
| 3 | Admin login form labels **"ADMIN EMAIL"** and **"PASSWORD"** and subtitle **"AUTHORIZED PERSONNEL ONLY"** are all `uppercase` — explicitly banned in CLAUDE.md design rules | `/admin/login` | Medium |
| 4 | Test account name **"Dr. Rajesh Sharma (Prod_Audit_Free)"** is visible in public search results — debug/test artefact showing in production listing | `/search` | Medium |
| 5 | `/vip` page `<title>` has **"TuitionsInIndia" duplicated** — reads "VIP Tuition Service — Guaranteed Tutor Matching \| TuitionsInIndia \| TuitionsInIndia" | `/vip` | Low |
| 6 | `/categories` page: **right column shows as a dashed empty container** — layout issue, right half of the grid appears blank | `/categories` | Low |
| 7 | **CLAUDE.md documents Pro at ₹499/month and Elite at ₹1,999/month**, but live pricing page correctly shows ₹699/month and ₹2,499/month. CLAUDE.md is out of date. | `/pricing/tutor` + `CLAUDE.md` | Low |
| 8 | Testing guide (Section 2) says registration asks for **name, email, phone, password** — the actual flow is **phone-OTP first**, with name/email captured in step 2. The guide needs updating to reflect the current flow. | `/register/tutor`, `/register/student` | Low (docs) |

---

## Sections Confirmed ✅ (Visual / Structural Pass)

| Section | What was verified |
|---------|-------------------|
| 1 — Public Pages | All pages load without errors. Homepage, /search (filters + cards + map), /categories (grid + 3 bottom cards clickable), all /how-it-works/* and /pricing/* pages, /get-started, /vip, /vip/apply (correctly auth-gated). All 3 header dropdowns work on desktop. Mobile hamburger exists in DOM (md:hidden). No JS console errors. |
| 2 — Tutor Registration | `/register/tutor` loads, 3-step flow (Verify Phone → Your Profile → Done), form is clean and functional. OTP-based — needs manual completion with real phone. |
| 3 — Admin Dashboard | `/admin/login` loads, email + password form present, "Return to public login" link present. Needs admin credentials to go further. |
| 5 — Student Registration | `/register/student` loads, 4-step flow (Verify Phone → 2 → 3 → Done), clean. Needs manual completion with real phone. |
| 13 — Institute Registration | `/register/institute` loads, 4-step flow (Verify Contact → Set Up Institute → Choose Plan → You're Live), clean. Needs manual completion with real phone. |

---

## Sections Requiring Manual Testing 🔧

These cannot be tested without a real phone (for OTP) and/or active credentials. You need to run these yourself:

| Section | What to test | What you need |
|---------|-------------|---------------|
| 2 — Tutor Onboarding | Complete full registration, check onboarding checklist (3 steps), fill profile, verify listing appears in /search, check welcome email says "demo class" (not "trial class") | Real phone for OTP |
| 3 — Admin Dashboard | Log in, check all tabs (Overview, Users, Analytics, Projections, Goals, Budget, Bookings, Blog, Emails, Automations), trigger Weekly Analysis | Admin credentials |
| 4 — Tutor Verification | Apply for verification, upload doc, admin approves → check email + badge. Also test rejection path with reason email. | Logged-in tutor + admin |
| 5 — Student Lead Posting | Post requirement (subject, grade, location, budget, description), confirm submission success | Real phone for OTP |
| 6 — Lead Unlocking | Unlock a lead, check credit deduction prompt, contact revealed, student notified, upsell modal triggers when credits < 10 | Logged-in tutor (5 free credits from signup) |
| 7 — Demo Class Booking | Student books demo, pays ₹149 deposit (test card: 4111 1111 1111 1111 / any expiry / CVV 123 / OTP 1234), tutor gets notified, **verify tab says "Demo Requests" not "Trial Requests"**, tutor accepts, student confirmed | Logged-in student + tutor, Razorpay Test Mode |
| 8 — Credit Purchase | Buy ₹99 credit pack, credits +10 immediately, receipt email arrives | Logged-in tutor, Razorpay Test Mode |
| 9 — Subscription Upgrade | Upgrade to Pro (₹699/month), Pro badge shows, priority ranking in search | Logged-in tutor, Razorpay Test Mode |
| 10 — Inquiry / Messaging | Student sends inquiry → tutor gets in-app notification + email with message + WhatsApp link | Logged-in student + tutor |
| 11 — Referral System | Find referral code/link, new tutor registers via it → original tutor gets "You earned 25 credits" notification + balance reflects +25 | Logged-in tutor + new registration |
| 12 — Phone Privacy | Toggle "Show phone publicly" OFF → confirm student view hides phone number | Logged-in tutor (Settings → Privacy) |
| 14 — Notifications | Bell icon shows unread count, list opens on click, marks read on click, links navigate correctly — all roles | All 3 logged-in accounts |
| 15 — Admin Weekly Insights | Trigger Weekly Analysis manually → insight cards show with HIGH/MEDIUM/LOW badges → "Mark all read" clears them | Admin credentials |

---

## Razorpay Mode Reminder
Before testing Sections 7, 8, 9 — confirm you're in **Test Mode** in your Razorpay dashboard.  
Test card: `4111 1111 1111 1111` | Expiry: any future date | CVV: any 3 digits | OTP: `1234`

---

## Summary
- **3 Medium issues** to fix before launch (button label, header logo contrast, admin form uppercase)
- **1 Medium issue** to clean up (test account visible in production search)
- **3 Low issues** (duplicate page title, empty categories column, CLAUDE.md pricing outdated)
- **13 sections** need manual run-through with real phone numbers + admin credentials + Razorpay test mode
