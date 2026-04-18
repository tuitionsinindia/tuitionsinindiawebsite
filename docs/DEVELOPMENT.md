# TuitionsInIndia — Development Workflow

## Local setup

```bash
# Clone and install
git clone <repo>
cd "Tuitions in india Website"
npm install

# Set up local env
cp .env.example .env.local
# Fill in: DATABASE_URL, SESSION_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
#          RESEND_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER,
#          GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Sync DB schema
npx prisma db push
npx prisma generate

# Start dev server
npm run dev
```

---

## Branch & Worktree Workflow

Never work directly on `main`. Use a Git worktree for each feature/fix:

```bash
# Create a new worktree for your feature
git worktree add .claude/worktrees/<branch-name> -b <branch-name>
cd .claude/worktrees/<branch-name>
npm install   # install deps in worktree (node_modules are separate)
npm run dev   # runs on a different port
```

When done:
```bash
# Merge back to main
git checkout main
git merge <branch-name>
git worktree remove .claude/worktrees/<branch-name>
```

---

## Deploy to Production

Full instructions: `.claude/commands/deploy.md`

```bash
# From the project root (or worktree):
bash deploy.sh
```

**What deploy.sh does:**
1. `rsync` the source to VPS at `/root/tuitionsinindia`, excluding `.env*` files and `node_modules`
2. SSH into VPS: `docker compose up --build -d`
3. Container rebuilt from Dockerfile, old container replaced

**After deploy, verify:**
```bash
ssh root@187.77.188.36 "docker ps | grep tuitionsinindia-web"
ssh root@187.77.188.36 "docker logs --tail 50 tuitionsinindia-web"
curl -I https://tuitionsinindia.com
```

---

## Environment Variables

### Production (`.env.production` on VPS at `/root/tuitionsinindia/.env.production`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | HMAC key for session tokens (required in production) |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification key |
| `RESEND_API_KEY` | Resend email API key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio sender number |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_BASE_URL` | `https://tuitionsinindia.com` |
| `NODE_ENV` | `production` |

### Recovering `.env.production` if deleted by rsync

```bash
ssh root@187.77.188.36 "docker inspect tuitionsinindia-web \
  --format '{{range .Config.Env}}{{println .}}{{end}}' \
  | grep -vE '^(PATH|NODE_VERSION|YARN_VERSION|HOME|HOSTNAME)=' \
  | tee /root/tuitionsinindia/.env.production"
```

---

## Database

**Schema file**: `prisma/schema.prisma`

**Never use** `prisma migrate` — always use `prisma db push`.

```bash
# After editing schema.prisma:
npx prisma db push       # sync schema to DB
npx prisma generate      # regenerate client

# Browse data:
npx prisma studio
```

---

## API Route Conventions

1. All routes must have `export const dynamic = "force-dynamic"` if they read from DB or cookies
2. Never instantiate API clients (Resend, Twilio, etc.) at module level — do it inside the handler
3. Use `prisma.$transaction(async (tx) => { ... })` for operations that must be atomic
4. Always return `NextResponse.json(...)` — never raw `Response`

---

## Common Issues

### Build fails with "Missing API key"
An SDK is being instantiated at module level. Move it inside the request handler:
```js
// ❌ Wrong — fails at build time
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Correct — only runs at request time
export async function POST(req) {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_build_placeholder');
    ...
}
```

### Docker container not restarting after deploy
Usually caused by missing `.env.production`. Recover it first (see above), then:
```bash
ssh root@187.77.188.36 "cd /root/tuitionsinindia && docker compose up -d --force-recreate"
```

### JSX renders literal "0"
```js
// ❌ Wrong — renders "0" when value is 0
{item.count && <Badge>{item.count}</Badge>}

// ✅ Correct
{item.count > 0 && <Badge>{item.count}</Badge>}
```

### Session secret error in production
`SESSION_SECRET` must be set in `.env.production`. The app throws at startup if it's missing.

---

## Claude Skills (Slash Commands)

| Command | Purpose |
|---|---|
| `/deploy` | Deploy to production and verify |
| `/qa` | Full QA checklist for the live site |
| `/new-feature` | Template for adding a new feature |
| `/db-schema` | Guide for adding a DB model |
| `/blog-post` | Guide for publishing a blog post |

Commands are defined in `.claude/commands/*.md`.
