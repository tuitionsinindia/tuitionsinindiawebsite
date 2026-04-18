# QA — Test the Live Site

Run a full quality-assurance pass on https://tuitionsinindia.com after a deployment.

## Checklist

### 1. Public pages
- [ ] Homepage loads, hero CTA buttons work
- [ ] `/categories` — all subject cards link to search, bottom 3 cards ("Top Rated", "Near You", "Quick Match") link correctly
- [ ] `/search` — results load, filters work (subject, location, role, sort)
- [ ] `/search/[id]` — tutor profile page loads, JSON-LD present in source (`<script type="application/ld+json">`)
- [ ] `/pricing/student`, `/pricing/tutor`, `/pricing/institute` — all three load without 404
- [ ] `/how-it-works/student`, `/how-it-works/tutor`, `/how-it-works/institute` — load correctly
- [ ] `/blog` — list page loads; click a post, post page loads
- [ ] `/about`, `/contact` — load without errors

### 2. Auth flows
- [ ] `/register` — role picker shows Student, Tutor, Institute
- [ ] `/register/tutor` — phone OTP step works (OTP SMS received), profile step saves
- [ ] `/register/student` — completes and lands on dashboard
- [ ] `/login` — phone OTP at top, Google button below
- [ ] Google sign-in popup — opens, authenticates, profile photo saved to DB
- [ ] Logout — session cookie cleared, redirect to homepage

### 3. Dashboard — Tutor
- [ ] `/dashboard/tutor` — loads without blank white screen
- [ ] Listing tab — edit subjects, rate, bio, save
- [ ] Credits tab — shows balance
- [ ] Buy credits modal — opens (don't complete real payment)

### 4. Dashboard — Student
- [ ] `/dashboard/student` — loads
- [ ] Post Requirement flow — submits successfully

### 5. Dashboard — Institute
- [ ] `/dashboard/institute` — loads

### 6. Payments (sandbox only)
- [ ] Razorpay order creation (`/api/payment/create-order`) returns an order ID
- [ ] Verify endpoint (`/api/payment/verify`) — do NOT test with real card in prod

### 7. Admin
- [ ] `/dashboard/admin` — accessible only with ADMIN role
- [ ] User list loads

### 8. Errors
- [ ] Tail Docker logs for any errors: `ssh root@187.77.188.36 "docker logs --tail 100 tuitionsinindia-web"`
- [ ] No `[Error]`, `[Unhandled]`, or `500` in logs after browsing

## How to run
```bash
# Check container is running
ssh root@187.77.188.36 "docker ps | grep tuitionsinindia-web"

# Tail logs while browsing
ssh root@187.77.188.36 "docker logs -f tuitionsinindia-web"
```

$ARGUMENTS
