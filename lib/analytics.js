/**
 * Analytics helper — fires GA4 + Meta Pixel events from one call.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('sign_up', { method: 'email', role: 'student' });
 */

// ── GA4 ──────────────────────────────────────────────────────────────────────
function gtagEvent(eventName, params = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
}

// ── Meta Pixel ───────────────────────────────────────────────────────────────
function fbqEvent(eventName, params = {}) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params);
    }
}

// ── Public API ───────────────────────────────────────────────────────────────

/** User signs up (student, tutor, or institute) */
export function trackSignUp(role) {
    gtagEvent('sign_up', { method: 'email', role });
    fbqEvent('CompleteRegistration', { content_name: role });
}

/** User searches for tutors */
export function trackSearch(params = {}) {
    gtagEvent('search', { search_term: params.subject || '', ...params });
    fbqEvent('Search', { search_string: params.subject || '', ...params });
}

/** User views a tutor profile */
export function trackViewProfile(tutorId, subject) {
    gtagEvent('view_item', { item_id: tutorId, item_category: subject });
    fbqEvent('ViewContent', { content_ids: [tutorId], content_type: 'tutor' });
}

/** User sends an enquiry / contacts a tutor */
export function trackEnquiry(tutorId, subject) {
    gtagEvent('generate_lead', { item_id: tutorId, item_category: subject });
    fbqEvent('Lead', { content_name: subject, content_ids: [tutorId] });
}

/** User purchases credits or a subscription */
export function trackPurchase(value, currency = 'INR', itemName) {
    gtagEvent('purchase', { value, currency, items: [{ item_name: itemName }] });
    fbqEvent('Purchase', { value, currency, content_name: itemName });
}

/** User starts checkout (clicks buy on pricing page) */
export function trackBeginCheckout(value, currency = 'INR', itemName) {
    gtagEvent('begin_checkout', { value, currency, items: [{ item_name: itemName }] });
    fbqEvent('InitiateCheckout', { value, currency, content_name: itemName });
}

/** Generic event for anything else */
export function trackEvent(eventName, params = {}) {
    gtagEvent(eventName, params);
    // Only fire known Meta standard events; skip custom ones to avoid pixel warnings
}
