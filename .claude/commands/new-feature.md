# New Feature

Add a new feature to TuitionsInIndia following the project conventions.

## Before you start

1. Read `CLAUDE.md` — confirm the feature doesn't violate design rules (no dark theme, no jargon, etc.)
2. Read `docs/TECH.md` — understand the stack and routing conventions
3. Identify which role(s) the feature serves: Student / Tutor / Institute / Admin / Public

## Steps

### 1. Plan
- Does it need a new page? → Create under `app/`
- Does it need new API routes? → Create under `app/api/`
- Does it need a new DB model? → Follow `/qa db-schema` first
- Does it need a new shared component? → Add to `app/components/`

### 2. Create the route / page
```
app/
  your-feature/
    page.js          ← server component (default)
    loading.js       ← optional skeleton
    error.js         ← optional error boundary
  api/
    your-feature/
      route.js       ← API handler
```

Use `export const dynamic = "force-dynamic"` on any API route that reads from the DB or uses cookies.

### 3. Auth guard (if protected)
```js
import { verifyToken } from "@/lib/session";
import { cookies } from "next/headers";

const token = cookies().get("ti_session")?.value;
const session = token ? verifyToken(token) : null;
if (!session) redirect("/login");
```

### 4. Design rules (STRICT — check before writing JSX)
- White background, `blue-600` accents, `rounded-xl` max
- `font-semibold` for headings, never `font-black`
- Sentence-case labels, never ALL-CAPS
- No jargon — see banned word list in `docs/BRAND.md`
- Buttons: "Save", "Submit", "Continue", "Sign Up", "Log In"

### 5. Test locally
```bash
cd ".claude/worktrees/<your-branch>"
npm run dev
```

### 6. Deploy
Run `/deploy` to push to production and verify.

## Checklist
- [ ] Page/route created under correct path
- [ ] Auth guard in place (if private)
- [ ] DB queries use Prisma (no raw SQL)
- [ ] No env vars read at module level (move inside handler)
- [ ] Design rules followed — no dark classes, no jargon
- [ ] Tested on mobile viewport (375px)

$ARGUMENTS
