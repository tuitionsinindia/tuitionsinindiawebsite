import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Admin blog GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, excerpt, content, category, author, readTime, coverImage, isPublished } = body;
        let { slug } = body;

        if (!title || !excerpt || !content || !category) {
            return NextResponse.json({ error: "title, excerpt, content, and category are required" }, { status: 400 });
        }

        if (!slug) {
            slug = generateSlug(title);
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                excerpt,
                content,
                category,
                slug,
                author: author || "TuitionsInIndia",
                readTime: readTime || "5 min read",
                coverImage: coverImage || null,
                isPublished: !!isPublished,
                publishedAt: isPublished ? new Date() : null,
            },
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Admin blog POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...fields } = body;

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const updateData = { ...fields };

        // Handle publishedAt based on isPublished change
        if (typeof fields.isPublished === "boolean") {
            if (fields.isPublished && !existing.isPublished) {
                updateData.publishedAt = new Date();
            } else if (!fields.isPublished) {
                updateData.publishedAt = null;
            }
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Admin blog PATCH error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        await prisma.blogPost.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin blog DELETE error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
