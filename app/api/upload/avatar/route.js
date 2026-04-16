import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = 'force-dynamic';

// POST /api/upload/avatar — upload a profile image as base64
export async function POST(request) {
    try {
        const { limited } = checkRateLimit(request, "avatar-upload", 5, 60000);
        if (limited) {
            return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
        }

        // Verify session
        const cookie = request.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Accept either JSON { image: dataUrl } or multipart FormData { file }
        const contentType = request.headers.get("content-type") || "";
        let dataUrl;

        if (contentType.includes("application/json")) {
            const body = await request.json();
            if (!body?.image || typeof body.image !== "string") {
                return NextResponse.json({ error: "No image provided" }, { status: 400 });
            }
            // Validate it's a base64 data URL for an allowed type
            if (!/^data:image\/(jpeg|png|webp);base64,/.test(body.image)) {
                return NextResponse.json({ error: "Invalid image format. Use JPEG, PNG, or WebP." }, { status: 400 });
            }
            // Rough size check: base64 overhead ~33%, 2MB raw ≈ 2.7MB base64
            if (body.image.length > 3 * 1024 * 1024) {
                return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
            }
            dataUrl = body.image;
        } else {
            const formData = await request.formData();
            const file = formData.get("file");
            if (!file || !(file instanceof Blob)) {
                return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
            }
            const MAX_SIZE = 2 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
            }
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, or WebP." }, { status: 400 });
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = buffer.toString("base64");
            dataUrl = `data:${file.type};base64,${base64}`;
        }

        // Update user's image field
        await prisma.user.update({
            where: { id: session.id },
            data: { image: dataUrl },
        });

        return NextResponse.json({ success: true, image: dataUrl });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
