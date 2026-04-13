import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

// GET — list blog posts (public: published only, admin: all)
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (all) {
        const cookie = req.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;
        const user = session?.userId ? await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } }) : null;
        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(posts);
    }

    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(posts);
}

// POST — create a blog post (admin only)
export async function POST(req) {
    try {
        const cookie = req.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;
        const user = session?.userId ? await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } }) : null;
        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, slug, excerpt, content, category, coverImage, author, readTime, isPublished } = body;

        if (!title || !slug || !content || !category) {
            return NextResponse.json({ error: "Title, slug, content, and category are required" }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
                excerpt: excerpt || title,
                content,
                category,
                coverImage: coverImage || null,
                author: author || "TuitionsInIndia",
                readTime: readTime || "5 min read",
                isPublished: isPublished || false,
                publishedAt: isPublished ? new Date() : null,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (err) {
        console.error("Blog POST error:", err);
        if (err.code === "P2002") {
            return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// PUT — update a blog post (admin only)
export async function PUT(req) {
    try {
        const cookie = req.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;
        const user = session?.userId ? await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } }) : null;
        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { id, ...data } = body;

        if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

        // If publishing for the first time, set publishedAt
        if (data.isPublished) {
            const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
            if (!existing?.publishedAt) data.publishedAt = new Date();
        }

        const post = await prisma.blogPost.update({ where: { id }, data });
        return NextResponse.json(post);
    } catch (err) {
        console.error("Blog PUT error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
