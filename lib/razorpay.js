import Razorpay from "razorpay";

// Lazily instantiate Razorpay so module-level import doesn't fail at build time
// when env vars are unavailable. Call getRazorpay() inside request handlers.
let _instance = null;

export function getRazorpay() {
    if (!_instance) {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            if (process.env.NODE_ENV === "production") {
                throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required in production");
            }
            // Dev/build: use placeholder values (no real API calls will succeed)
            console.warn("[razorpay] Keys not set — using placeholder values (dev only)");
        }

        _instance = new Razorpay({
            key_id: key_id || "rzp_test_placeholder",
            key_secret: key_secret || "rzp_test_placeholder",
        });
    }
    return _instance;
}

// Default export for backward compatibility
export default { getRazorpay };
