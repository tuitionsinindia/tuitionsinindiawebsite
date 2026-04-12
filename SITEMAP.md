# TuitionsInIndia — Site Structure

> This is the source of truth for every page on the site. Do not add, remove, or rename pages without updating this document.

## Public Pages (No login required)

| URL | Page | Purpose |
|-----|------|---------|
| `/` | Homepage | Hero, search bar, stats, how it works, subjects, CTA |
| `/search` | Search Results | Filter and browse tutors by subject, location, grade |
| `/search/[id]` | Tutor Profile | Public tutor profile — bio, subjects, reviews, CTA |
| `/tutors` | Tutor Directory | Browse all tutors (redirects to /search) |
| `/tutors/[subject]` | Subject Directory | SEO page — tutors for a specific subject |
| `/tutors/[subject]/[city]` | Subject+City Directory | SEO page — tutors for subject in a city |
| `/subjects` | All Subjects | Browse subjects with tutor counts |
| `/categories` | Categories | Browse by category (coaching, competitive, etc.) |
| `/blog` | Blog | Articles for students and tutors |
| `/about` | About Us | Company story, values, team |
| `/contact` | Contact | Contact form + support info |
| `/ai-match` | Smart Match | AI-powered tutor matching tool |

## Auth Pages

| URL | Page | Purpose |
|-----|------|---------|
| `/get-started` | Role Selection | Choose: Student, Tutor, or Institute |
| `/login` | Login | OTP-based phone login |
| `/register/student` | Student Registration | OTP verify → post requirement |
| `/register/tutor` | Tutor Registration | OTP verify → build profile |
| `/register/institute` | Institute Registration | OTP verify → profile → optional payment |
| `/admin/login` | Admin Login | Email+password admin auth |

## Student Dashboard (Requires STUDENT session)

| URL | Page | Purpose |
|-----|------|---------|
| `/dashboard/student` | Student Home | Metrics, active requests, matched tutors |
| Tabs: HOME, REQUIREMENTS, MATCHES, CHAT, CONTACTS, BILLING, SETTINGS | (in-page) | Navigation within dashboard |

## Tutor Dashboard (Requires TUTOR session)

| URL | Page | Purpose |
|-----|------|---------|
| `/dashboard/tutor` | Tutor Home | Metrics, student leads, earnings |
| `/dashboard/tutor/profile` | Profile Editor | Edit tutor profile details |
| `/dashboard/tutor/earnings` | Earnings | Transaction history |
| Tabs: HOME, LEADS, BATCHES, CHAT, REVENUE, SETTINGS | (in-page) | Navigation within dashboard |

## Institute Dashboard (Requires INSTITUTE session)

| URL | Page | Purpose |
|-----|------|---------|
| `/dashboard/institute` | Institute Home | Overview metrics, leads, courses |
| `/dashboard/institute/profile` | Profile Editor | Edit institute profile |
| `/dashboard/institute/leads` | Lead Management | View and manage student leads |
| `/dashboard/institute/instructors` | Instructor Management | (Future) Manage teaching staff |
| Tabs: HOME, LEADS, RECRUITMENT, CHAT, COURSES, BILLING, SETTINGS | (in-page) | Navigation within dashboard |

## Admin Dashboard (Requires ADMIN auth)

| URL | Page | Purpose |
|-----|------|---------|
| `/dashboard/admin` | Admin Panel | Users, leads, financials, system metrics |

## Informational Pages

| URL | Page | Purpose |
|-----|------|---------|
| `/how-it-works/student` | Student Guide | Step-by-step for students |
| `/how-it-works/tutor` | Tutor Guide | Step-by-step for tutors |
| `/how-it-works/institute` | Institute Guide | Step-by-step for institutes |
| `/pricing/student` | Student Pricing | Credit packs, what's free |
| `/pricing/tutor` | Tutor Pricing | FREE/PRO/ELITE comparison |
| `/faq/student` | Student FAQ | Common student questions |
| `/faq/tutor` | Tutor FAQ | Common tutor questions |
| `/kb/student` | Student Knowledge Base | Detailed guides |
| `/kb/tutor` | Tutor Knowledge Base | Detailed guides |

## Legal Pages

| URL | Page | Purpose |
|-----|------|---------|
| `/legal/privacy` | Privacy Policy | Data handling and privacy |
| `/legal/terms` | Terms of Service | Usage terms |
| `/legal/cookies` | Cookie Policy | Cookie usage |

## Utility Pages

| URL | Page | Purpose |
|-----|------|---------|
| `/post-requirement` | Post Requirement | Quick requirement posting form |
| `/select-level` | Grade Selection | Grade/level picker (used in flows) |
| `/not-found` | 404 Page | Error page for missing routes |

## Redirects

| From | To | Reason |
|------|----|----- |
| `/tutor/[id]` | `/search/[id]` | Consolidated to single profile page |
| `/tutors` | `/search` | Unified search experience |

## API Routes (49 total)

### Authentication
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/otp/send` | Send OTP (login + registration) |
| POST | `/api/auth/otp/verify` | Verify OTP, set session cookie |
| GET | `/api/auth/session` | Get current user from session |
| POST | `/api/auth/logout` | Clear session cookie |
| POST | `/api/auth/password-reset` | Send password reset email |
| POST | `/api/auth/register/tutor` | Legacy tutor registration |
| POST | `/api/auth/register/institute` | Institute registration |

### Users
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/user/info` | Get user profile (session required) |
| POST | `/api/user/update` | Update profile + notification prefs |
| GET | `/api/user/transactions` | Transaction history |
| POST | `/api/upload/avatar` | Upload profile photo |

### Search & Matching
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/search/tutors` | Search tutors with filters |
| GET | `/api/matching/matches` | Get AI matches for user |
| POST | `/api/ai-match` | AI matching endpoint |

### Leads (Student Requirements)
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/lead/post` | Create lead (public form) |
| POST | `/api/leads/create` | Create lead (dashboard) |
| GET | `/api/lead/list` | List leads for tutor |
| POST | `/api/lead/unlock` | Unlock student contact |
| POST | `/api/lead/boost` | Boost lead visibility |
| POST | `/api/lead/close` | Close a lead |
| GET | `/api/student/active-leads` | Student's active leads |
| GET | `/api/student/unlocked-tutors` | Tutors who unlocked student |

### Chat
| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/api/chat/session` | Get or create chat session |
| GET/POST | `/api/chat/messages` | Get or send messages |

### Payments
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/payment/order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment + add credits |
| POST | `/api/ad/purchase` | Purchase featured listing |

### Notifications
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/notifications` | Get notifications (session required) |
| PATCH | `/api/notifications` | Mark read |

### Admin
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/admin/auth` | Admin login |
| GET | `/api/admin/users` | List all users |
| GET/PATCH | `/api/admin/leads` | Manage leads |
| POST | `/api/admin/lead/assign` | Assign lead to tutor |
| GET | `/api/admin/metrics` | System metrics |
| POST | `/api/admin/tutor/approve` | Approve tutor listing |
| PATCH | `/api/admin/user/tier` | Change user plan |
| PATCH | `/api/admin/user/suspend` | Suspend user |
| PATCH | `/api/admin/user/credits` | Adjust credits |

### Other
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/contact` | Contact form submission |
| POST | `/api/cron/reset-credits` | Monthly credit refresh |
| POST | `/api/review` | Submit review |
| GET | `/api/subjects` | List subjects |
| GET | `/api/tutor/stats` | Tutor analytics |
| GET | `/api/tutor/my-students` | Tutor's students |
| POST | `/api/tutor/profile/update` | Update tutor profile |
| GET | `/api/institute/courses` | Institute courses |
| GET | `/api/subscription/plans` | Available plans |
