/**
 * intentStore.js
 * Client-side localStorage helper for storing a pending student action
 * (e.g. "view contact" or "send inquiry" for a specific tutor) across
 * the login / signup redirect flow.
 *
 * Usage:
 *   saveIntent({ action: 'contact', tutorId: '...', tutorName: '...' })
 *   const intent = getIntent();   // returns null if expired or absent
 *   clearIntent();
 */

const KEY = "tii_pending_intent";
const TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * @param {{ action: 'contact'|'inquiry', tutorId: string, tutorName?: string, subject?: string }} intent
 */
export function saveIntent(intent) {
    try {
        localStorage.setItem(KEY, JSON.stringify({ ...intent, savedAt: Date.now() }));
    } catch {
        // localStorage may be unavailable (e.g. SSR or private mode)
    }
}

/**
 * Returns the stored intent, or null if absent / expired.
 * @returns {{ action: string, tutorId: string, tutorName?: string, subject?: string } | null}
 */
export function getIntent() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const intent = JSON.parse(raw);
        if (!intent?.tutorId || !intent?.action) return null;
        if (Date.now() - (intent.savedAt || 0) > TTL_MS) {
            clearIntent();
            return null;
        }
        return intent;
    } catch {
        return null;
    }
}

/** Remove the stored intent. Call after the action has been executed. */
export function clearIntent() {
    try {
        localStorage.removeItem(KEY);
    } catch {}
}
