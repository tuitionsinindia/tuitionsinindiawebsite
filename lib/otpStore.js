// lib/otpStore.js
// In-memory store for holding temporary OTPs
const globalForOtp = global;
if (!globalForOtp.otpStore) {
    globalForOtp.otpStore = new Map();
}
export const otpStore = globalForOtp.otpStore;
