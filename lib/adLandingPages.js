// Ad-traffic landing pages (separate from SEO directory pages).
// Most variants are generated from a small template + a (subject, city)
// catalog so adding a new ad target is a one-line change. Custom hand-tuned
// pages can still live in CUSTOM_PAGES if a campaign needs unique copy.

// ─── City catalog (used for both stats and testimonial flavour) ────────────
const CITY_DATA = {
    delhi: {
        name: "Delhi",
        regions: "South Delhi, Dwarka, Rohini, Gurgaon, Noida, Faridabad and Ghaziabad",
        avgRate: "₹400–1,200",
    },
    mumbai: {
        name: "Mumbai",
        regions: "Andheri, Bandra, Thane, Powai, Navi Mumbai and the western suburbs",
        avgRate: "₹500–1,400",
    },
    bangalore: {
        name: "Bangalore",
        regions: "Koramangala, HSR, Whitefield, Indiranagar, JP Nagar and Electronic City",
        avgRate: "₹450–1,300",
    },
    hyderabad: {
        name: "Hyderabad",
        regions: "Hitech City, Gachibowli, Madhapur, Kondapur, Banjara Hills and Secunderabad",
        avgRate: "₹400–1,100",
    },
    chennai: {
        name: "Chennai",
        regions: "T. Nagar, Velachery, Adyar, OMR, Anna Nagar and Tambaram",
        avgRate: "₹400–1,100",
    },
    pune: {
        name: "Pune",
        regions: "Kothrud, Aundh, Hinjewadi, Viman Nagar, Baner and Wakad",
        avgRate: "₹400–1,200",
    },
    kolkata: {
        name: "Kolkata",
        regions: "Salt Lake, Park Street, Ballygunge, Howrah and New Town",
        avgRate: "₹350–1,000",
    },
};

// ─── Subject catalog ───────────────────────────────────────────────────────
const SUBJECT_DATA = {
    maths: {
        name: "Maths",
        full: "Mathematics",
        eyebrowSuffix: "Maths tuition",
        headlineHook: (city) => `Struggling with Maths? Find the right tutor in ${city} this week.`,
        subhead: "Verified home and online Maths tutors for Class 6–12, JEE, NEET and boards. Most parents hear back within 12 hours.",
    },
    physics: {
        name: "Physics",
        full: "Physics",
        eyebrowSuffix: "Physics tuition",
        headlineHook: (city) => `Master Physics. Find a tutor in ${city} who actually explains it.`,
        subhead: "Verified Physics tutors for Class 11, 12, JEE and NEET — with reviews from real students. No commission, no chasing.",
    },
    chemistry: {
        name: "Chemistry",
        full: "Chemistry",
        eyebrowSuffix: "Chemistry tuition",
        headlineHook: (city) => `Chemistry not clicking? Find the right tutor in ${city} now.`,
        subhead: "Verified Chemistry tutors for boards, JEE and NEET. Strong with organic, inorganic and physical — same syllabus your child is following.",
    },
    biology: {
        name: "Biology",
        full: "Biology",
        eyebrowSuffix: "Biology tuition",
        headlineHook: (city) => `Find the right Biology tutor in ${city} for boards and NEET.`,
        subhead: "Verified Biology tutors with NEET prep experience. Free to search. Most parents are connected within 12 hours.",
    },
    english: {
        name: "English",
        full: "English",
        eyebrowSuffix: "English tuition",
        headlineHook: (city) => `Better English in ${city} — verified tutors for school, exams and spoken.`,
        subhead: "Tutors for school grammar, board exams, IELTS, spoken English and writing. All verified. Free to search.",
    },
    hindi: {
        name: "Hindi",
        full: "Hindi",
        eyebrowSuffix: "Hindi tuition",
        headlineHook: (city) => `Find a great Hindi tutor in ${city} — verified, reviewed, ready.`,
        subhead: "For boards, school, or learning Hindi as a second language. Verified tutors with student reviews.",
    },
    coding: {
        name: "Coding",
        full: "Computer Science",
        eyebrowSuffix: "Coding & Computer Science tuition",
        headlineHook: (city) => `Coding tutors in ${city} for school CS, boards and beyond.`,
        subhead: "Python, Java, web dev, school computer science, board exams. Tutors for kids, teens and college students.",
    },
};

// Generic city-only "home tutor" template (no specific subject).
const HOME_TUTOR_TEMPLATE = (cityKey) => {
    const c = CITY_DATA[cityKey];
    return {
        metaTitle: `Home Tutors in ${c.name} — Verified & Rated`,
        metaDescription: `Find verified home tutors in ${c.name} for school, board exams, JEE, NEET and all skills. Free to search. Connect in hours, not days.`,
        eyebrow: `Home tuition across ${c.name}`,
        headline: `The right home tutor for your child — in ${c.name}, this week.`,
        subheadline: `From Class 1 to Class 12, JEE, NEET, music, coding and beyond. Verified tutors in every area of ${c.name}.`,
        subject: "",
        location: c.name,
        stats: [
            { value: "500+", label: `Tutors in ${c.name}` },
            { value: "4.7★", label: "Average rating" },
            { value: "50+",  label: "Subjects covered" },
        ],
        bullets: [
            "Maths, Science, English, all Indian languages, coding, arts and music — one platform.",
            `Verified profiles. Filter by area (${c.regions}).`,
            "Zero commission. Your tutor keeps 100% of the fee you agree on.",
        ],
        testimonials: defaultTestimonials(c.name),
        faqs: [
            { q: `Which areas of ${c.name} do you cover?`, a: `All areas — ${c.regions}, and surrounding neighbourhoods. Mention your area when posting.` },
            { q: "What subjects are available?", a: "Every major school subject (Class 1–12), all competitive exams (JEE, NEET, CET, UPSC), Indian and foreign languages, coding, music, arts and sports." },
            { q: "How do I know the tutor is safe?", a: "Verified tutors have completed ID and qualification checks. You also see genuine reviews from other parents before making contact." },
            { q: "What does it cost?", a: `Browsing and posting requirements is free. You pay the tutor directly — most ${c.name} home tutors charge ${c.avgRate} per hour depending on grade and subject.` },
        ],
    };
};

// Subject + city template.
const SUBJECT_CITY_TEMPLATE = (subjectKey, cityKey) => {
    const s = SUBJECT_DATA[subjectKey];
    const c = CITY_DATA[cityKey];
    return {
        metaTitle: `Top Rated ${s.name} Tutors in ${c.name} — Home & Online`,
        metaDescription: `Find verified ${s.name} tutors in ${c.name} for Class 6–12, JEE, NEET and boards. Book a demo class from ₹149. Zero commission.`,
        eyebrow: `${s.eyebrowSuffix} in ${c.name}`,
        headline: s.headlineHook(c.name),
        subheadline: s.subhead,
        subject: s.full,
        location: c.name,
        stats: [
            { value: "300+",  label: `${s.name} tutors in ${c.name}` },
            { value: "4.8★",  label: "Average rating" },
            { value: "12 hr", label: "Avg response time" },
        ],
        bullets: [
            `Every ${s.name} tutor is ID-verified — you see qualifications and reviews before contact.`,
            "Zero commission. You pay the tutor directly at rates you agree.",
            "Book a demo class for ₹149 — refundable as credit if you don't continue.",
        ],
        testimonials: defaultTestimonials(c.name, s.name),
        faqs: [
            { q: "How does it work?", a: `Post your requirement (${s.name}, grade, area, budget). Tutors matching your criteria will contact you directly — usually within 12 hours.` },
            { q: "Is it really free?", a: "Posting a requirement and receiving tutor contacts is free. Booking a demo class is ₹149, refundable as platform credit if you don't continue. No commission on tuition fees." },
            { q: "What if I don't like the tutor?", a: "Book a demo first. If it doesn't happen or the tutor doesn't suit you, you get your ₹149 back as platform credit." },
            { q: `Do you cover all of ${c.name}?`, a: `Yes — ${c.regions} are all covered. Online classes are available India-wide.` },
        ],
    };
};

function defaultTestimonials(cityName, subjectName) {
    if (subjectName) {
        return [
            { name: "Pooja S.",  role: `Parent, ${cityName}`, quote: `My son's ${subjectName} tutor was booked through TuitionsInIndia in two days. He went from a D to a B in one term.`, rating: 5 },
            { name: "Ankit R.",  role: `Class 10, ${cityName}`, quote: "Tried two tutors before finding the right one. The demo class system saved us money.", rating: 5 },
            { name: "Meera G.",  role: `Parent, ${cityName}`, quote: "Verified profiles and real reviews — nothing like OLX or random WhatsApp groups.", rating: 5 },
        ];
    }
    return [
        { name: "Karthik V.",  role: `Parent, ${cityName}`, quote: "Found a tutor who comes to our home twice a week. Profile and reviews gave us confidence from day one.", rating: 5 },
        { name: "Sneha P.",   role: `Parent, ${cityName}`, quote: "Needed a specific subject — got three options in a day. None of the platforms I tried before delivered like this.", rating: 5 },
        { name: "Deepak R.",  role: `Parent, ${cityName}`, quote: "Switched from a coaching institute to a home tutor. Half the cost, 2x the attention. Wish I'd done this earlier.", rating: 5 },
    ];
}

// ─── Generated catalog ─────────────────────────────────────────────────────
// Add or remove entries here to spin up / retire a campaign URL.
const SUBJECT_CITY_PAGES = [
    ["maths",     "delhi"],
    ["maths",     "mumbai"],
    ["maths",     "bangalore"],
    ["physics",   "delhi"],
    ["physics",   "mumbai"],
    ["physics",   "bangalore"],
    ["chemistry", "delhi"],
    ["chemistry", "mumbai"],
    ["english",   "delhi"],
    ["english",   "bangalore"],
    ["biology",   "mumbai"],
    ["coding",    "bangalore"],
];

const HOME_TUTOR_CITIES = [
    "delhi", "mumbai", "bangalore", "hyderabad", "pune", "chennai",
];

function slugFor(subjectKey, cityKey) {
    return `${subjectKey}-tutor-${cityKey}`;
}

function homeSlugFor(cityKey) {
    return `home-tutor-${cityKey}`;
}

// Build the AD_LANDING_PAGES map on module load.
export const AD_LANDING_PAGES = (() => {
    const pages = {};
    for (const [subjectKey, cityKey] of SUBJECT_CITY_PAGES) {
        pages[slugFor(subjectKey, cityKey)] = SUBJECT_CITY_TEMPLATE(subjectKey, cityKey);
    }
    for (const cityKey of HOME_TUTOR_CITIES) {
        pages[homeSlugFor(cityKey)] = HOME_TUTOR_TEMPLATE(cityKey);
    }
    return pages;
})();

export function getAdLandingPage(slug) {
    return AD_LANDING_PAGES[slug] || null;
}

export function listAdLandingSlugs() {
    return Object.keys(AD_LANDING_PAGES);
}
