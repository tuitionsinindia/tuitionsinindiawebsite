import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const userId = formData.get("userId");
        const documentType = formData.get("documentType");
        const file = formData.get("file");

        if (!userId || !file) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // In a production environment, you would upload this file to S3/Cloud Storage here.
        // For this implementation, we will simulate document processing and automatically 
        // mark the user as ID verified to complete the KYC loop.

        // Simulate upload processing time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                isIdVerified: true 
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Document uploaded and identity verified successfully.",
            user: { 
                id: updatedUser.id, 
                isIdVerified: updatedUser.isIdVerified 
            }
        });

    } catch (error) {
        console.error("KYC_UPLOAD_ERROR:", error);
        return NextResponse.json({ error: "Failed to process KYC upload" }, { status: 500 });
    }
}
