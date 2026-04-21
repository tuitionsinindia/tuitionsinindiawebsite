import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * POST /api/push/register
 * Body: { userId, token }
 *
 * Stores the Expo push token for a user so the server can
 * send push notifications to their device.
 */
export async function POST(request) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, token } = await request.json();

    if (!userId || !token) {
      return NextResponse.json({ error: "userId and token required" }, { status: 400 });
    }

    // Caller must own this record
    if (session.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken: token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Push] Register error:", error);
    return NextResponse.json({ error: "Failed to register push token" }, { status: 500 });
  }
}
