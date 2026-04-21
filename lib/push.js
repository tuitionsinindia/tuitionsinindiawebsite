/**
 * Expo Push Notification sender.
 * Uses Expo's free push service — no extra SDK needed on the server.
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Send a push notification to one or more Expo push tokens.
 *
 * @param {string|string[]} tokens - Expo push token(s) e.g. "ExponentPushToken[xxx]"
 * @param {object} payload - { title, body, data }
 */
export async function sendPushNotification(tokens, { title, body, data = {} }) {
  const tokenList = Array.isArray(tokens) ? tokens : [tokens];

  // Filter out nulls and non-Expo tokens
  const valid = tokenList.filter(
    (t) => t && (t.startsWith("ExponentPushToken") || t.startsWith("ExpoPushToken"))
  );

  if (valid.length === 0) return;

  const messages = valid.map((to) => ({
    to,
    sound: "default",
    title,
    body,
    data,
    channelId: "leads", // Android channel
  }));

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

    if (!res.ok) {
      console.error("[Push] Expo push API error:", res.status);
      return;
    }

    const result = await res.json();
    console.log(`[Push] Sent to ${valid.length} device(s):`, result?.data?.[0]?.status);
  } catch (err) {
    console.error("[Push] Failed to send:", err);
  }
}

/**
 * Notify all matching tutors about a new student lead.
 * Finds tutors whose subjects/locations overlap with the lead,
 * then fires a push to every tutor who has a push token registered.
 */
export async function notifyMatchingTutors(prisma, lead) {
  try {
    const tutors = await prisma.user.findMany({
      where: {
        role: "TUTOR",
        expoPushToken: { not: null },
        tutorListing: {
          isActive: true,
          ...(lead.subjects?.length > 0
            ? { subjects: { hasSome: lead.subjects } }
            : {}),
        },
      },
      select: { expoPushToken: true, name: true },
      take: 200,
    });

    if (tutors.length === 0) return;

    const tokens = tutors.map((t) => t.expoPushToken).filter(Boolean);
    const subject = lead.subjects?.[0] || "a subject";
    const location = lead.locations?.[0] || "your area";

    await sendPushNotification(tokens, {
      title: "🔔 New Student Lead",
      body: `A student needs a ${subject} tutor in ${location}. Tap to view.`,
      data: { type: "NEW_LEAD", leadId: lead.id },
    });

    console.log(`[Push] Notified ${tokens.length} tutors about lead ${lead.id}`);
  } catch (err) {
    console.error("[Push] notifyMatchingTutors error:", err);
  }
}
