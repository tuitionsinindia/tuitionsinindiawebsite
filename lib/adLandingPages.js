// Ad-traffic landing pages (separate from SEO directory pages).
// Kept in one place so new variants can be spun up per campaign without
// creating new route files. Keys must stay URL-safe.

export const AD_LANDING_PAGES = {
    "maths-tutor-delhi": {
        // SEO / meta
        metaTitle: "Top Rated Maths Tutors in Delhi — Home & Online",
        metaDescription: "Find verified Maths tutors in Delhi for Class 6–12, JEE and boards. Book a demo class from ₹149. Zero commission. First inquiry free.",
        // Hero
        eyebrow: "Home & online tuition in Delhi",
        headline: "Struggling with Maths? Find the right tutor in Delhi this week.",
        subheadline: "Verified home and online Maths tutors for Class 6–12, JEE, NEET and boards. Most parents hear back within 12 hours.",
        // Defaults the form pre-fills with
        subject: "Mathematics",
        location: "Delhi",
        // Trust row
        stats: [
            { value: "500+", label: "Verified Maths tutors" },
            { value: "4.8★", label: "Average rating" },
            { value: "12 hr", label: "Avg response time" },
        ],
        // Why-us bullets
        bullets: [
            "Every tutor is ID-verified — you see qualifications and reviews before contact.",
            "Zero commission. You pay the tutor directly at rates you agree.",
            "Book a demo class for ₹149 — refundable as credit if you don't continue.",
        ],
        // Testimonials
        testimonials: [
            { name: "Pooja S.", role: "Parent, Dwarka", quote: "My son's Maths teacher was booked through TuitionsInIndia in two days. He went from a D to a B in one term.", rating: 5 },
            { name: "Ankit R.", role: "Class 10 student, Rohini", quote: "Tried two tutors before finding the right one. The demo class system saved us money.", rating: 5 },
            { name: "Meera G.", role: "Parent, Saket", quote: "Verified profiles and real reviews — nothing like OLX or random WhatsApp groups.", rating: 5 },
        ],
        // FAQ
        faqs: [
            { q: "How does it work?", a: "Post your requirement (subject, grade, area, budget). Tutors matching your criteria will contact you directly — usually within 12 hours." },
            { q: "Is it really free?", a: "Posting a requirement and receiving tutor contacts is free. If you want to book a demo class, it's ₹149 (refundable as credit). No commission on tuition fees." },
            { q: "What if I don't like the tutor?", a: "Book a demo class first. If it doesn't happen or the tutor doesn't suit you, you get your ₹149 back as platform credit." },
            { q: "Do you cover all of Delhi NCR?", a: "Yes — South Delhi, North Delhi, Dwarka, Rohini, Gurgaon, Noida, Faridabad and Ghaziabad are all covered. Online classes are available India-wide." },
        ],
    },

    "physics-tutor-mumbai": {
        metaTitle: "Verified Physics Tutors in Mumbai — Class 11, 12 & JEE",
        metaDescription: "Find top-rated Physics tutors in Mumbai for Class 11, 12, JEE, NEET and boards. Free to search. Book a demo class from ₹149.",
        eyebrow: "Home & online Physics tuition in Mumbai",
        headline: "Master Physics. Find a tutor in Mumbai who actually explains it.",
        subheadline: "Verified Physics tutors for Class 11, 12, JEE and NEET — with reviews from real students. No commission, no chasing.",
        subject: "Physics",
        location: "Mumbai",
        stats: [
            { value: "300+", label: "Physics tutors in Mumbai" },
            { value: "4.9★", label: "Average rating" },
            { value: "89%", label: "Book a 2nd class" },
        ],
        bullets: [
            "Filter by board (CBSE, ICSE, HSC, IB) and exam target (JEE Main, JEE Advanced, NEET).",
            "Every tutor is verified with qualifications and genuine student reviews.",
            "Meet at home, your tutor's centre, or online — whichever works.",
        ],
        testimonials: [
            { name: "Aditya M.", role: "JEE 2026 aspirant, Andheri", quote: "Changed Physics tutor after 2 months and my mock score jumped 40 marks. Found him here on day one.", rating: 5 },
            { name: "Nisha J.", role: "Parent, Thane", quote: "My daughter struggled with Class 11 Physics. The tutor matched her exactly — same board, same textbook.", rating: 5 },
            { name: "Rohit K.", role: "Class 12, Bandra", quote: "I needed online classes because of my coaching schedule. Found a tutor who teaches at 9:30 pm.", rating: 5 },
        ],
        faqs: [
            { q: "Do you have tutors for JEE Advanced?", a: "Yes. Filter for JEE Advanced experience and you'll see tutors with proven student results. Many are IIT alumni." },
            { q: "Can the tutor match my coaching class pace?", a: "Most Physics tutors in Mumbai are familiar with Allen, FIITJEE, Aakash and Pace syllabi. Mention your coaching in the requirement." },
            { q: "Home or online — what's better?", a: "Class 9–10 usually benefits from home tuition. Class 11–12 / JEE students often prefer online to save commute time. Your tutor will guide you." },
            { q: "Is there a commitment?", a: "No. Pay your tutor directly by session, week, or month — your choice. We don't take any fee from the tuition." },
        ],
    },

    "home-tutor-bangalore": {
        metaTitle: "Home Tutors in Bangalore — Verified & Rated",
        metaDescription: "Find verified home tutors in Bangalore for school, board exams, JEE, NEET and all skills. Free to search. Connect in hours, not days.",
        eyebrow: "Home tuition across Bangalore",
        headline: "The right home tutor for your child — in Bangalore, this week.",
        subheadline: "From Class 1 to Class 12, JEE, NEET, music, coding and beyond. Verified tutors in every area of Bangalore.",
        subject: "",
        location: "Bangalore",
        stats: [
            { value: "800+", label: "Tutors in Bangalore" },
            { value: "4.7★", label: "Average rating" },
            { value: "50+", label: "Subjects covered" },
        ],
        bullets: [
            "Maths, Science, English, all Indian languages, coding, arts and music — one platform.",
            "Verified profiles. Filter by area (Koramangala, Whitefield, HSR, Indiranagar, and more).",
            "Zero commission. Your tutor keeps 100% of the fee you agree on.",
        ],
        testimonials: [
            { name: "Karthik V.", role: "Parent, Whitefield", quote: "Found a Class 5 tutor who comes to our apartment twice a week. Profile and reviews gave us confidence from day one.", rating: 5 },
            { name: "Sneha P.", role: "Parent, HSR Layout", quote: "Needed Kannada tuition for my daughter — not many platforms have that. Got three options in a day.", rating: 5 },
            { name: "Deepak R.", role: "Parent, Indiranagar", quote: "Switched from an institute to a home tutor. Half the cost, 2x the attention. Wish I'd done this earlier.", rating: 5 },
        ],
        faqs: [
            { q: "Which areas of Bangalore do you cover?", a: "All areas — Koramangala, HSR, Whitefield, Indiranagar, JP Nagar, Jayanagar, Bannerghatta, Electronic City, Hebbal, Sarjapur, and more. Mention your area when posting." },
            { q: "What subjects are available?", a: "Every major school subject (Class 1–12), all competitive exams (JEE, NEET, CET, UPSC), Indian and foreign languages, coding, music, arts and sports." },
            { q: "How do I know the tutor is safe?", a: "Verified tutors have completed ID and qualification checks. You also see genuine reviews from other parents before making contact." },
            { q: "What does it cost?", a: "Browsing and posting requirements is free. You pay the tutor directly — most Bangalore home tutors charge ₹400–1,200 per hour depending on grade and subject." },
        ],
    },
};

export function getAdLandingPage(slug) {
    return AD_LANDING_PAGES[slug] || null;
}

export function listAdLandingSlugs() {
    return Object.keys(AD_LANDING_PAGES);
}
