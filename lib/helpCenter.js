// Help center knowledge base. Used by:
//   - /help page (browsable)
//   - Chatbot's get_help_article tool (lookup by slug or keyword)
//
// Keep article bodies short and punchy — the chatbot reads these and
// paraphrases. Long pages are fine for humans but dilute LLM responses.

export const HELP_CATEGORIES = [
    {
        id: "getting-started",
        label: "Getting started",
        articles: [
            {
                slug: "how-it-works-students",
                title: "How it works for students and parents",
                body:
                    "1. Search for tutors by subject, grade and city, or post a requirement for free and let tutors contact you. " +
                    "2. Every tutor profile shows verified qualifications, hourly rate and real reviews. " +
                    "3. Book a demo class for ₹149 (refundable as credit if you don't continue). " +
                    "4. Pay the tutor directly for regular classes — we don't take any commission on tuition fees.",
            },
            {
                slug: "how-it-works-tutors",
                title: "How it works for tutors",
                body:
                    "1. Sign up and build your profile — subjects, grades, experience, hourly rate, photo and bio. " +
                    "2. Students nearby post requirements; matching ones appear in your dashboard. " +
                    "3. Use credits to unlock a student's contact details. You get 5 free credits on signup. " +
                    "4. Contact the student on WhatsApp or phone and take it from there. " +
                    "Zero commission — you keep 100% of what the student pays you.",
            },
            {
                slug: "signup-process",
                title: "How do I sign up?",
                body:
                    "Go to /get-started and pick your role (student, tutor or institute). " +
                    "Signup takes about 2 minutes — you verify your phone with an OTP, add your name and a few details. " +
                    "No credit card needed.",
            },
        ],
    },
    {
        id: "pricing-and-credits",
        label: "Pricing & credits",
        articles: [
            {
                slug: "student-pricing",
                title: "Is it really free for students?",
                body:
                    "Yes. Searching, posting requirements and receiving tutor contacts are 100% free. " +
                    "Students only pay the tutor directly at a rate you both agree on. " +
                    "Demo classes cost ₹149 (refundable as platform credit if you don't continue).",
            },
            {
                slug: "tutor-pricing",
                title: "How much does it cost for tutors?",
                body:
                    "Free tier: 5 free credits on signup, enough to unlock your first 5 student contacts. " +
                    "PRO: ₹699/month — 30 credits, verified badge, priority in search results. " +
                    "ELITE: ₹2,499/month — 100 credits, featured listing. " +
                    "Credit packs: ₹99 for 10, ₹249 for 30, ₹449 for 60. " +
                    "Founding-tutor offer: the first 500 tutors get PRO free for 30 days at signup.",
            },
            {
                slug: "credits-work",
                title: "How do credits work?",
                body:
                    "1 credit unlocks 1 student's contact details (phone + email). " +
                    "Credits don't expire. PRO and ELITE plans refill credits monthly.",
            },
        ],
    },
    {
        id: "safety-and-trust",
        label: "Safety & verification",
        articles: [
            {
                slug: "verification",
                title: "How do you verify tutors?",
                body:
                    "Every tutor's profile is manually reviewed before it goes live. " +
                    "Verified tutors have additionally submitted a government ID and qualification proof and have a blue badge on their profile. " +
                    "The first 100 tutors get free verification; after that it's a ₹999 one-time fee.",
            },
            {
                slug: "safety",
                title: "Is it safe to share my number with tutors?",
                body:
                    "Your phone number is only shared with tutors who unlock your contact (they pay credits to do this, so spam is unlikely). " +
                    "You can also toggle 'Show phone publicly' off in Settings → Privacy — then only tutors you contact first can see it.",
            },
        ],
    },
    {
        id: "demos-and-classes",
        label: "Demo classes & teaching",
        articles: [
            {
                slug: "demo-class",
                title: "What is a demo class?",
                body:
                    "A short introductory session with a tutor before you commit to regular classes. " +
                    "Costs ₹149 to book. If the tutor doesn't show up or you don't continue with them, you get the ₹149 back as platform credit. " +
                    "Some tutors mark their demos as free — then no deposit is needed.",
            },
            {
                slug: "home-vs-online",
                title: "Home tuition vs online classes?",
                body:
                    "Both are available on the platform. Filter by 'Teaching mode' on search. " +
                    "Class 9–10 students usually prefer home tuition. Class 11–12 and JEE/NEET aspirants often prefer online to save commute time.",
            },
        ],
    },
    {
        id: "billing-and-refunds",
        label: "Billing & refunds",
        articles: [
            {
                slug: "refund-policy",
                title: "Refund policy",
                body:
                    "Demo class deposits (₹149) are refundable as platform credit if the demo doesn't happen or the tutor is marked unsuitable within 24 hours. " +
                    "PRO/ELITE subscriptions: cancel any time from Settings → Billing. No refunds on partially-used months. " +
                    "Credit packs are non-refundable once credits are consumed.",
            },
            {
                slug: "payment-methods",
                title: "Which payment methods do you accept?",
                body:
                    "All major Indian payment methods via Razorpay: UPI, credit cards, debit cards, net banking, and wallets (Paytm, PhonePe, Google Pay).",
            },
        ],
    },
];

export function getAllArticles() {
    return HELP_CATEGORIES.flatMap((c) =>
        c.articles.map((a) => ({ ...a, categoryId: c.id, categoryLabel: c.label }))
    );
}

export function getArticleBySlug(slug) {
    return getAllArticles().find((a) => a.slug === slug) || null;
}

// Simple keyword search for the chatbot tool. Returns the top 3 matches.
export function searchArticles(query) {
    if (!query || typeof query !== "string") return [];
    const q = query.toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = getAllArticles().map((a) => {
        const haystack = `${a.title} ${a.body}`.toLowerCase();
        const score = tokens.reduce((s, t) => s + (haystack.includes(t) ? 1 : 0), 0);
        return { article: a, score };
    });
    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((s) => s.article);
}
