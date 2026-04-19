// Shared email wrapper for consistent branding
const BRAND_COLOR = "#2563EB";
const BRAND_NAME = "TuitionsInIndia";
const SITE_URL = "https://tuitionsinindia.com";

function wrap(content, unsubscribeUrl = null) {
    return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
<!-- Header -->
<tr><td style="background:${BRAND_COLOR};padding:24px 32px;text-align:center">
<img src="${SITE_URL}/logo.png" alt="${BRAND_NAME}" width="32" height="32" style="vertical-align:middle;margin-right:8px;border-radius:8px">
<span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-0.5px;vertical-align:middle">${BRAND_NAME}</span>
</td></tr>
<!-- Content -->
<tr><td style="padding:32px">
${content}
</td></tr>
<!-- Footer -->
<tr><td style="padding:20px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">${BRAND_NAME} — India's Trusted Tutor Discovery Platform</p>
<p style="margin:8px 0 0;color:#d1d5db;font-size:11px"><a href="${SITE_URL}/legal/privacy" style="color:#9ca3af">Privacy</a> · <a href="${SITE_URL}/legal/terms" style="color:#9ca3af">Terms</a> · <a href="${SITE_URL}/contact" style="color:#9ca3af">Contact</a>${unsubscribeUrl ? ` · <a href="${unsubscribeUrl}" style="color:#9ca3af">Unsubscribe</a>` : ""}</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function button(text, url) {
    return `<a href="${url}" style="display:inline-block;padding:12px 28px;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;margin:16px 0">${text}</a>`;
}

export function welcomeTemplate(name, role) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Welcome, ${name}!</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Thank you for joining TuitionsInIndia as a <strong>${role}</strong>. Your account is ready.</p>
<p style="margin:0 0 4px;color:#6b7280;font-size:14px;line-height:1.6">Here's what you can do next:</p>
<ul style="margin:8px 0 16px;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8">
${role === "Tutor" || role === "Institute"
    ? `<li>Complete your profile to appear in search</li><li>Browse student requirements matching your subjects</li><li>Upgrade to PRO for unlimited lead unlocks</li>`
    : `<li>Post a requirement to find matching tutors</li><li>Browse tutors by subject and location</li><li>Chat with tutors who respond to your requirements</li>`
}
</ul>
${button("Go to Dashboard", `${SITE_URL}/login`)}
`);
}

export function leadAlertTemplate(lead) {
    const subject = lead.subjects?.[0] || lead.subject || "a subject";
    const location = lead.locations?.[0] || lead.location || "India";
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">New Student Requirement</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">A student in <strong>${location}</strong> is looking for a <strong>${subject}</strong> tutor.</p>
<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px">
<p style="margin:0 0 8px;color:#374151;font-size:14px"><strong>Requirement:</strong> "${lead.description || "No description"}"</p>
<p style="margin:0;color:#374151;font-size:14px"><strong>Budget:</strong> ${lead.budget ? `₹${lead.budget}/hr` : "Open for discussion"}</p>
</div>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px">Log in to unlock this lead before other tutors.</p>
${button("View Lead", `${SITE_URL}/login`)}
`);
}

export function paymentReceiptTemplate(transaction) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Payment Received</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Thank you for your payment. Here are the details:</p>
<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px">
<table width="100%" style="font-size:14px;color:#374151">
<tr><td style="padding:4px 0;color:#9ca3af">Transaction ID</td><td style="padding:4px 0;text-align:right;font-weight:600">${transaction.transactionId}</td></tr>
<tr><td style="padding:4px 0;color:#9ca3af">Amount</td><td style="padding:4px 0;text-align:right;font-weight:600;color:#059669">₹${transaction.amount}</td></tr>
<tr><td style="padding:4px 0;color:#9ca3af">Description</td><td style="padding:4px 0;text-align:right">${transaction.description}</td></tr>
<tr><td style="padding:4px 0;color:#9ca3af">Date</td><td style="padding:4px 0;text-align:right">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
</table>
</div>
${button("View Billing History", `${SITE_URL}/login`)}
`);
}

function unsubscribeLink(userId) {
    return userId ? `${SITE_URL}/unsubscribe?uid=${userId}` : null;
}

// ── Day 3 Follow-up (Student) ──────────────────────────────────────────────
export function studentDay3Template(name, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">How TuitionsInIndia Works</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${name}, here's a quick guide to finding the right tutor:</p>
<ol style="margin:8px 0 16px;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8">
<li><strong>Search</strong> — Enter your subject, level, and city</li>
<li><strong>Compare</strong> — Browse tutor profiles, ratings, and fees</li>
<li><strong>Connect</strong> — Contact the tutor directly. No commission, no middleman.</li>
</ol>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px">You can also post a requirement and let tutors come to you.</p>
${button("Find a Tutor", `${SITE_URL}/search`)}
`, unsubscribeLink(userId));
}

// ── Day 7 Follow-up (Student) ──────────────────────────────────────────────
export function studentDay7Template(name, tutorCount, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Top Tutors Near You</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${name}, there are <strong>${tutorCount}+ verified tutors</strong> on TuitionsInIndia ready to help you.</p>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Whether you need help with board exams, JEE/NEET, or any subject — search for free and connect directly.</p>
${button("Browse Tutors", `${SITE_URL}/search`)}
`, unsubscribeLink(userId));
}

// ── Day 1 Follow-up (Tutor) — profile completion nudge ────────────────────
export function tutorDay1Template(name, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Hi ${name}, your profile is 1 step away from going live</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Welcome to TuitionsInIndia. To start receiving student enquiries, finish your tutor profile in the next 5 minutes:</p>
<ol style="margin:8px 0 16px;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8">
<li><strong>Add your subjects, grades and hourly rate</strong> — students filter by these.</li>
<li><strong>Upload a clear profile photo</strong> — profiles with photos get 4× more contacts.</li>
<li><strong>Write a 2-line bio</strong> — your background and what makes you a good tutor.</li>
</ol>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">You already have <strong>5 free credits</strong> waiting — enough to unlock your first 5 student leads.</p>
${button("Complete My Profile", `${SITE_URL}/dashboard/tutor/profile`)}
`, unsubscribeLink(userId));
}

// ── Day 3 Follow-up (Tutor) ────────────────────────────────────────────────
export function tutorDay3Template(name, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Tips to Get More Students</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${name}, here are 3 things top tutors do on TuitionsInIndia:</p>
<ol style="margin:8px 0 16px;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8">
<li><strong>Complete your profile</strong> — Add subjects, experience, and a photo. Complete profiles get 3x more enquiries.</li>
<li><strong>Respond quickly</strong> — Students prefer tutors who reply within a few hours.</li>
<li><strong>Ask for reviews</strong> — Even 1-2 reviews from existing students boost your visibility.</li>
</ol>
${button("Update Your Profile", `${SITE_URL}/login`)}
`, unsubscribeLink(userId));
}

// ── Day 7 Follow-up (Tutor) ────────────────────────────────────────────────
export function tutorDay7Template(name, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Your First Contact is Free</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${name}, you can unlock your first student lead for free on TuitionsInIndia!</p>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Want more leads? Upgrade to <strong>Pro</strong> and get 30 credits per month, a verified badge, and priority search ranking — all for ₹499/month.</p>
${button("View Plans", `${SITE_URL}/pricing/tutor`)}
`, unsubscribeLink(userId));
}

// ── Re-engagement (14-day inactive) ────────────────────────────────────────
export function reEngagementTemplate(name, matchCount, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">We Found New Matches For You</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${name}, we noticed you haven't visited in a while. Since your last visit, <strong>${matchCount} new tutors</strong> have joined that match your interests.</p>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Come back and check them out — it's still free to search and connect.</p>
${button("See New Tutors", `${SITE_URL}/search`)}
`, unsubscribeLink(userId));
}

// ── Conversion Nudge (Viewed profile but didn't contact) ───────────────────
export function conversionNudgeTemplate(name, tutorName, subject, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">${tutorName} Still Has Availability</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${name}, you recently viewed the profile of <strong>${tutorName}</strong>, a ${subject} tutor on TuitionsInIndia.</p>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">They still have open slots. Contact them now to get started.</p>
${button("Contact Tutor", `${SITE_URL}/search`)}
`, unsubscribeLink(userId));
}

// ── Lead posted confirmation — sent to the STUDENT after they post a requirement ──
export function leadPostedTemplate(name, lead) {
    const subject = lead.subjects?.[0] || lead.subject || "your subject";
    const location = lead.locations?.[0] || lead.location || "your area";
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Your requirement is posted ✓</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${escapeHtml(name)}, thanks for posting your tuition requirement. Matching ${escapeHtml(subject)} tutors in ${escapeHtml(location)} will get in touch — usually within 12 hours.</p>
<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px;font-size:14px;color:#374151">
<p style="margin:0 0 6px"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<p style="margin:0 0 6px"><strong>Location:</strong> ${escapeHtml(location)}</p>
${lead.budget ? `<p style="margin:0 0 6px"><strong>Budget:</strong> ₹${lead.budget}/hr</p>` : ""}
${lead.description ? `<p style="margin:0"><strong>Notes:</strong> ${escapeHtml(lead.description).slice(0, 200)}</p>` : ""}
</div>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px">Want to speed things up? Browse verified tutors yourself:</p>
${button("See matching tutors", `${SITE_URL}/search?subject=${encodeURIComponent(subject)}&location=${encodeURIComponent(location)}&role=TUTOR`)}
`);
}

// ── Ticket copy — sent to the USER who raised the ticket (separate from admin copy) ──
export function ticketUserCopyTemplate(ticket) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">We've got your ticket</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${escapeHtml(ticket.name || "there")}, thanks for reaching out. Our ${ticket.type === "SALES" ? "sales" : "support"} team will reply within 24 hours.</p>
<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px;font-size:14px;color:#374151">
<p style="margin:0 0 6px"><strong>Ticket ID:</strong> <code>${escapeHtml(ticket.id)}</code></p>
<p style="margin:0 0 6px"><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
<p style="margin:12px 0 0;color:#6b7280;font-size:13px;white-space:pre-wrap">${escapeHtml(ticket.body).slice(0, 500)}${ticket.body.length > 500 ? "…" : ""}</p>
</div>
<p style="margin:0;color:#9ca3af;font-size:12px">Reply to this email to add more details — it will be attached to the same ticket.</p>
`);
}

// ── Weekly tutor digest — "you got X leads, top N unlocked" ──
export function weeklyTutorDigestTemplate(name, stats, userId) {
    const topLeadsHtml = (stats.topLeads || []).slice(0, 3).map(l => `
        <li style="margin:0 0 8px"><strong>${escapeHtml(l.subject || "Tutoring")}</strong> in ${escapeHtml(l.location || "online")} · ${l.budget ? `₹${l.budget}/hr` : "budget open"}</li>
    `).join("");
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Your week on TuitionsInIndia</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${escapeHtml(name)}, here's a quick summary of the last 7 days:</p>
<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px">
<table width="100%" style="font-size:14px;color:#374151">
<tr><td style="padding:4px 0;color:#9ca3af">New matching leads</td><td style="padding:4px 0;text-align:right;font-weight:600">${stats.newLeads || 0}</td></tr>
<tr><td style="padding:4px 0;color:#9ca3af">Leads you unlocked</td><td style="padding:4px 0;text-align:right;font-weight:600">${stats.unlocksUsed || 0}</td></tr>
<tr><td style="padding:4px 0;color:#9ca3af">Credits remaining</td><td style="padding:4px 0;text-align:right;font-weight:600">${stats.creditsRemaining || 0}</td></tr>
</table>
</div>
${topLeadsHtml ? `<h3 style="margin:16px 0 8px;font-size:14px;color:#111827">Top fresh leads this week</h3><ul style="margin:0 0 16px;padding-left:18px;color:#6b7280;font-size:14px">${topLeadsHtml}</ul>` : ""}
${button("Open my dashboard", `${SITE_URL}/dashboard/tutor`)}
`, unsubscribeLink(userId));
}

// ── Weekly student digest — "new tutors matching your search" ──
export function weeklyStudentDigestTemplate(name, stats, userId) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">New tutors matching your requirement</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${escapeHtml(name)}, ${stats.newTutors || 0} new tutors joined this week ${stats.subject ? `teaching <strong>${escapeHtml(stats.subject)}</strong>` : ""}${stats.location ? ` in <strong>${escapeHtml(stats.location)}</strong>` : ""}.</p>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Tap below to browse them — still free to contact, still zero commission.</p>
${button("See the new tutors", `${SITE_URL}/search${stats.subject ? `?subject=${encodeURIComponent(stats.subject)}` : ""}${stats.location ? `${stats.subject ? "&" : "?"}location=${encodeURIComponent(stats.location)}` : ""}&role=TUTOR`)}
`, unsubscribeLink(userId));
}

// Plain internal notification — goes to the admin/sales inbox, not to a user.
// Keep styling minimal so it's fast to scan in Gmail.
export function ticketNotificationTemplate(ticket) {
    const typeLabel = ticket.type === "SALES" ? "Sales enquiry" : "Support ticket";
    const contactBits = [
        ticket.name ? `<strong>Name:</strong> ${escapeHtml(ticket.name)}` : null,
        ticket.email ? `<strong>Email:</strong> ${escapeHtml(ticket.email)}` : null,
        ticket.phone ? `<strong>Phone:</strong> ${escapeHtml(ticket.phone)}` : null,
        ticket.userId ? `<strong>User ID:</strong> <code>${escapeHtml(ticket.userId)}</code>` : null,
        ticket.sourcePath ? `<strong>Page:</strong> <code>${escapeHtml(ticket.sourcePath)}</code>` : null,
    ].filter(Boolean).join("<br>");

    const transcriptHtml = ticket.chatTranscript
        ? `<details style="margin-top:16px"><summary style="cursor:pointer;color:#6b7280;font-size:12px">Chat transcript</summary><pre style="background:#f9fafb;padding:12px;border-radius:8px;font-size:12px;white-space:pre-wrap;margin-top:8px">${escapeHtml(
            typeof ticket.chatTranscript === "string" ? ticket.chatTranscript : JSON.stringify(ticket.chatTranscript, null, 2)
        )}</pre></details>`
        : "";

    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">${typeLabel}: ${escapeHtml(ticket.subject)}</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:13px">Ticket ID: <code>${escapeHtml(ticket.id)}</code></p>
<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6">
${contactBits || '<em style="color:#9ca3af">No contact details provided.</em>'}
</div>
<h3 style="margin:16px 0 8px;color:#111827;font-size:16px">Message</h3>
<p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(ticket.body)}</p>
${transcriptHtml}
${button("Open in admin", `${SITE_URL}/dashboard/admin`)}
`);
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function passwordResetTemplate(resetLink) {
    return wrap(`
<h2 style="margin:0 0 8px;color:#111827;font-size:20px">Reset Your Password</h2>
<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6">Click the button below to set a new password. This link expires in 1 hour.</p>
${button("Reset Password", resetLink)}
<p style="margin:16px 0 0;color:#9ca3af;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
`);
}
