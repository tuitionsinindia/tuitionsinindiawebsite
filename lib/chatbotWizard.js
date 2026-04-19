// Chatbot signup wizard — scripted, option-driven onboarding.
// This drives the Chatbot component's state machine. The LLM (Aarav) is used
// only for free-text questions the user types; the wizard itself is 100%
// deterministic so the signup flow is predictable.

import { SUBJECT_CATEGORIES, CITY_OPTIONS } from "./subjects";

// Grade levels the user can pick from. Only shown when the selected
// category doesn't already imply a level (e.g. school categories do).
export const GRADE_CHOICES = [
    { value: "Class 1-5",       label: "Class 1 – 5" },
    { value: "Class 6-8",       label: "Class 6 – 8" },
    { value: "Class 9-10",      label: "Class 9 – 10 (boards)" },
    { value: "Class 11-12",     label: "Class 11 – 12" },
    { value: "Graduate",        label: "College / Graduate" },
    { value: "Working Professional", label: "Working professional" },
];

export const BUDGET_CHOICES = [
    { value: "flexible",   label: "Flexible / Open" },
    { value: "under_300",  label: "Under ₹300/hr" },
    { value: "300_500",    label: "₹300 – 500/hr" },
    { value: "500_800",    label: "₹500 – 800/hr" },
    { value: "800_1500",   label: "₹800 – 1,500/hr" },
    { value: "1500_plus",  label: "₹1,500+/hr" },
];

export const TUTOR_RATE_CHOICES = [
    { value: 300,  label: "₹300/hr" },
    { value: 500,  label: "₹500/hr" },
    { value: 800,  label: "₹800/hr" },
    { value: 1200, label: "₹1,200/hr" },
    { value: 1800, label: "₹1,800/hr" },
    { value: 2500, label: "₹2,500/hr" },
];

export const MODE_CHOICES = [
    { value: "HOME",    label: "Home tuition" },
    { value: "ONLINE",  label: "Online classes" },
    { value: "BOTH",    label: "Either — flexible" },
];

export const EXPERIENCE_CHOICES = [
    { value: 0,  label: "Less than 1 year" },
    { value: 2,  label: "1 – 3 years" },
    { value: 4,  label: "3 – 5 years" },
    { value: 7,  label: "5 – 10 years" },
    { value: 12, label: "10+ years" },
];

// Top 12 cities — rendered as chips. Anything else routes to free text.
export const TOP_CITIES = [
    "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune",
    "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Gurgaon", "Noida",
];

// ─── Wizard flows per role ────────────────────────────────────────────────
// Each flow is an ordered list of stage identifiers. The Chatbot component
// walks through them, collecting one field per stage.

export const STUDENT_FLOW = [
    "category",    // SUBJECT_CATEGORIES
    "subject",     // subjects in the chosen category
    "grade",       // GRADE_CHOICES (skipped if implied by category)
    "mode",        // MODE_CHOICES
    "city",        // TOP_CITIES or free text
    "budget",      // BUDGET_CHOICES
    "contact",     // name + phone + email form
    "confirm",     // summary + submit
    "done",        // post lead, redirect to /search
];

// Tutor / Institute flows: short chat qualifier, then HAND OFF to the real
// signup page. Industry best practice — chat captures intent, dedicated page
// handles OTP, legal consent, profile details, photo upload, verification.
export const TUTOR_FLOW = [
    "category",   // what area they teach
    "subject",   // which subject
    "city",      // primary city
    "handoff",   // CTA → /register/tutor?category=...&subject=...&city=...
];

export const INSTITUTE_FLOW = [
    "institute_name",
    "category",
    "subject",
    "city",
    "handoff",   // CTA → /register/institute?name=...&subject=...&city=...
];

// Categories whose name implies a grade level (so we skip the grade step).
const CATEGORY_IMPLIES_GRADE = new Set([
    "school_k5", "school_6_10", "school_11_12_sci", "school_11_12_comm",
    "school_11_12_hum", "college_uni", "exam_prep",
]);

export function shouldSkipGrade(categoryId) {
    return CATEGORY_IMPLIES_GRADE.has(categoryId);
}

export function getCategoryById(id) {
    return SUBJECT_CATEGORIES.find((c) => c.id === id) || null;
}

export function getFlowForRole(role) {
    if (role === "STUDENT") return STUDENT_FLOW;
    if (role === "TUTOR") return TUTOR_FLOW;
    if (role === "INSTITUTE") return INSTITUTE_FLOW;
    return STUDENT_FLOW;
}

// Build a human-readable summary for the confirm stage.
export function formatWizardSummary(role, data) {
    const lines = [];
    if (role === "STUDENT") {
        if (data.subject)   lines.push(["Subject", data.subject]);
        if (data.grade)     lines.push(["Grade / level", data.grade]);
        if (data.mode)      lines.push(["Mode", MODE_CHOICES.find((m) => m.value === data.mode)?.label || data.mode]);
        if (data.city)      lines.push(["City", data.city]);
        if (data.budget)    lines.push(["Budget", BUDGET_CHOICES.find((b) => b.value === data.budget)?.label || data.budget]);
        if (data.name)      lines.push(["Name", data.name]);
        if (data.phone)     lines.push(["Phone", data.phone]);
        if (data.email)     lines.push(["Email", data.email]);
    } else if (role === "TUTOR") {
        if (data.subject)   lines.push(["Subject", data.subject]);
        if (data.grade)     lines.push(["Level taught", data.grade]);
        if (data.city)      lines.push(["City", data.city]);
        if (data.rate)      lines.push(["Rate", `₹${data.rate}/hr`]);
        if (data.experience !== undefined) {
            const exp = EXPERIENCE_CHOICES.find((e) => e.value === data.experience);
            lines.push(["Experience", exp?.label || `${data.experience}+ years`]);
        }
        if (data.name)      lines.push(["Name", data.name]);
        if (data.phone)     lines.push(["Phone", `${data.phone} ✓ verified`]);
        if (data.email)     lines.push(["Email", data.email]);
    } else if (role === "INSTITUTE") {
        if (data.institute_name) lines.push(["Institute", data.institute_name]);
        if (data.subject)   lines.push(["Offering", data.subject]);
        if (data.city)      lines.push(["City", data.city]);
        if (data.name)      lines.push(["Contact", data.name]);
        if (data.phone)     lines.push(["Phone", `${data.phone} ✓ verified`]);
        if (data.email)     lines.push(["Email", data.email]);
    }
    return lines;
}

// Budget values → rupee range for the search URL / lead record.
export function budgetToMaxRupees(budgetValue) {
    const map = {
        under_300: 300,
        "300_500": 500,
        "500_800": 800,
        "800_1500": 1500,
        "1500_plus": null, // no ceiling
    };
    return map[budgetValue] ?? null;
}

// Prompt/question shown at each stage, keyed by role+stage. Short and
// conversational — remember the wizard is option-driven, not text-driven.
export const STAGE_PROMPTS = {
    STUDENT: {
        category: "What kind of tuition are you looking for?",
        subject:  "Which subject do you need help with?",
        grade:    "What grade or level is the student in?",
        mode:     "How would you prefer classes?",
        city:     "Which city or area?",
        budget:   "What's your hourly budget?",
        contact:  "Almost done. Share your contact details so tutors can reach you.",
        confirm:  "Here's what I'll post. Looks good?",
        done:     "Request posted! Showing you matching tutors now.",
    },
    TUTOR: {
        category: "What area do you teach in?",
        subject:  "Which subject?",
        city:     "Which city are you based in?",
        handoff:  "I'll take you to the tutor signup page — pre-filled so you can finish in 2 minutes.",
    },
    INSTITUTE: {
        institute_name: "What's the name of your institute?",
        category: "What do you primarily teach?",
        subject:  "Main subject or programme?",
        city:     "Which city is the institute in?",
        handoff:  "I'll take you to the institute signup page — pre-filled so you can complete the listing with verification + details.",
    },
};
