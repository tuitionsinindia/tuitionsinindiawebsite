# TuitionsInIndia — Technical Architecture

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.9 (App Router) |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS v3 |
| Database | PostgreSQL (managed on VPS) |
| ORM | Prisma (schema-first, `db push`) |
| Auth | Custom HMAC-SHA256 session tokens (no NextAuth) |
| Payments | Razorpay |
| Email | Resend |
| SMS / OTP | Twilio |
| Deployment | Docker Compose on Hostinger VPS |
| Icons | Lucide React |

---

## App Router Structure

```
app/
  page.js                    ← Homepage (public)
  layout.js                  ← Root layout (fonts, metadata)
  categories/page.js         ← Browse by subject category
  search/
    page.js                  ← Tutor search with filters
    [id]/page.js             ← Individual tutor profile (SEO: Person JSON-LD)
  login/page.js              ← Phone OTP first, then Google OAuth
  register/
    page.js                  ← Role picker
    student/page.js
    tutor/page.js
    institute/page.js
  dashboard/
    student/page.js
    tutor/page.js
    institute/page.js
    admin/page.js
  pricing/
    student/page.js
    tutor/page.js
    institute/page.js
  how-it-works/
    student/page.js
    tutor/page.js
    institute/page.js
  blog/
    page.js                  ← Post list
    [slug]/page.js           ← Individual post
  about/page.js
  contact/page.js
  api/
    auth/
      google/route.js        ← Initiates Google OAuth, sets linkUserId cookie
      google/callback/route.js ← Handles Google callback, links or creates user
      phone/send-otp/route.js
      phone/verify-otp/route.js
      logout/route.js
    user/
      update/route.js        ← Updates name, email, image, etc.
    payment/
      create-order/route.js  ← Creates Razorpay order, records PENDING transaction
      verify/route.js        ← Verifies HMAC signature, credits user, sends receipt
      webhook/route.js       ← Razorpay async events (payment.captured, etc.)
    contact/route.js         ← Sends email via Resend
    search/route.js          ← Tutor/institute search API
    requirements/route.js    ← Student requirement CRUD
    listings/route.js        ← Tutor listing CRUD
```

---

## Authentication

Sessions are custom HMAC-SHA256 tokens (not JWT, not NextAuth).

**Cookie**: `ti_session` — HttpOnly, SameSite=Lax, Secure in production, 30-day expiry.

**Token format**: `base64url(payload).hmac_hex`

**Payload**: `{ id, role, exp }`

**Key utilities** (`lib/session.js`):
- `createSessionToken(user)` — signs a new token
- `verifyToken(token)` — returns payload or null if invalid/expired
- `makeSessionCookie(token)` — returns Set-Cookie header string
- `clearSessionCookie()` — returns Max-Age=0 cookie to log out

**Required env var**: `SESSION_SECRET` (throws in production if missing).

---

## Google OAuth Flow

1. User visits `/api/auth/google?role=TUTOR&linkUserId=<userId>` (optional linkUserId for account linking)
2. Server stores `linkUserId` in a short-lived HttpOnly cookie (`google_oauth_link_user`, Max-Age=600)
3. User authenticates with Google, lands on `/api/auth/google/callback`
4. Callback priority lookup:
   1. `linkUserId` cookie → link Google to existing phone-verified user
   2. Existing user by `googleId`
   3. Existing user by email → link accounts
   4. Create new user (registration flow only)
5. Session cookie set, user redirected to dashboard

---

## Database (Prisma)

**Key models**: `User`, `TutorListing`, `InstituteProfile`, `StudentRequirement`, `Transaction`, `Review`, `Notification`, `OtpCode`

**Schema location**: `prisma/schema.prisma`

**Push to DB** (no migration files):
```bash
npx prisma db push
npx prisma generate
```

**On production**:
```bash
ssh root@187.77.188.36 "cd /root/tuitionsinindia && docker compose exec web npx prisma db push"
```

---

## Business Model & Credits

| Tier | Price | Credits/month |
|---|---|---|
| Free | ₹0 | 0 |
| PRO | ₹499/month | 30 |
| ELITE | ₹1,999/month | 100 |

- Credits are also sold in packs: ₹99 (10), ₹249 (30), ₹449 (60)
- 1 credit = unlock 1 student contact detail
- Featured listing: ₹199/week or ₹499/month
- Lead boost (bump a requirement to top): ₹49/requirement

---

## Payments (Razorpay)

**Flow**:
1. `POST /api/payment/create-order` — creates Razorpay order + PENDING `Transaction` row
2. Frontend opens Razorpay checkout modal
3. On success: `POST /api/payment/verify` — HMAC signature verified, credits added, transaction marked SUCCESS, receipt email sent
4. Fallback: `POST /api/payment/webhook` — handles delayed captures (browser closed early)

**Env vars needed**:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET` (set in Razorpay dashboard)

**Webhook URL** (register in Razorpay dashboard):
`https://tuitionsinindia.com/api/payment/webhook`
Events: `payment.captured`, `subscription.charged`, `payment.failed`

---

## Email (Resend)

**Env var**: `RESEND_API_KEY`

**Sending emails** (`lib/email.js`):
- `sendPaymentReceiptEmail(email, { transactionId, amount, description })`
- `sendWelcomeEmail(email, name)`
- `sendContactEmail(fromEmail, toEmail, message)`

**Important**: Always instantiate `new Resend(...)` INSIDE the request handler, never at module level. During Docker build, env vars are unavailable and module-level instantiation causes build failures.

---

## SMS / OTP (Twilio)

**Env vars**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

OTP codes stored in `OtpCode` table, expire after 10 minutes, max 3 attempts.

---

## Deployment

See `docs/DEVELOPMENT.md` for the full workflow. See `.claude/commands/deploy.md` for the deploy command.

**Quick deploy**: `bash deploy.sh` from the project root or worktree.

**VPS**: Hostinger, `root@187.77.188.36`, app at `/root/tuitionsinindia`, Docker container `tuitionsinindia-web`, port 3006 (proxied via Nginx on 80/443).
