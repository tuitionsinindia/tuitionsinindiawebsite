// Early-tutor promo: first N TUTOR signups get a complimentary PRO trial
// for X days. Used both at signup time (to grant) and on public landing
// pages (to display "X spots left" urgency).

import prisma from "@/lib/prisma";

export const EARLY_TUTOR_PRO_LIMIT = 500;
export const EARLY_TUTOR_PRO_DAYS = 30;

export async function getEarlyTutorPromoStatus() {
    const tutorCount = await prisma.user.count({ where: { role: "TUTOR" } });
    const slotsRemaining = Math.max(0, EARLY_TUTOR_PRO_LIMIT - tutorCount);
    return {
        limit: EARLY_TUTOR_PRO_LIMIT,
        days: EARLY_TUTOR_PRO_DAYS,
        slotsRemaining,
        slotsUsed: Math.min(tutorCount, EARLY_TUTOR_PRO_LIMIT),
        isActive: slotsRemaining > 0,
    };
}

// Returns the data needed to grant PRO at signup, or null if the offer is
// closed. Caller spreads this into the user.create / user.update payload.
export async function maybeGrantEarlyTutorPro(role) {
    if (role !== "TUTOR") return null;
    const status = await getEarlyTutorPromoStatus();
    if (!status.isActive) return null;
    const proUntil = new Date(Date.now() + EARLY_TUTOR_PRO_DAYS * 24 * 60 * 60 * 1000);
    return {
        subscriptionTier: "PRO",
        subscriptionStatus: "ACTIVE",
        proGrantedUntil: proUntil,
    };
}
