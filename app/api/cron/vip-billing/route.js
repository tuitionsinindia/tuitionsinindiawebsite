export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/cron/vip-billing
// Run on the 1st of each month.
// For each active VipContract, creates a PENDING VipPayment if none exists for this month.
// Notifies students to pay via the platform.
export async function POST(request) {
    const authHeader = request.headers.get("x-cron-key");
    if (!authHeader || authHeader !== process.env.AUDIT_SEED_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Find all active VIP contracts
        const activeContracts = await prisma.vipContract.findMany({
            where: { status: "ACTIVE" },
            include: {
                student: { select: { id: true, name: true, email: true } },
                tutor: { select: { id: true, name: true } },
            },
        });

        let created = 0;
        let skipped = 0;

        for (const contract of activeContracts) {
            // Check if a payment already exists for this month
            const existingPayment = await prisma.vipPayment.findFirst({
                where: {
                    contractId: contract.id,
                    dueDate: { gte: monthStart, lte: monthEnd },
                },
            });

            if (existingPayment) {
                skipped++;
                continue;
            }

            // Create the pending payment record
            await prisma.vipPayment.create({
                data: {
                    contractId: contract.id,
                    amount: contract.monthlyFee,
                    tutorPayout: contract.tutorPayout,
                    platformCut: contract.platformCut,
                    status: "PENDING",
                    dueDate: new Date(now.getFullYear(), now.getMonth(), 7), // Due by 7th of month
                },
            });

            // Notify student
            await prisma.notification.create({
                data: {
                    userId: contract.studentId,
                    type: "VIP_PAYMENT",
                    title: "Monthly VIP payment due",
                    body: `Your monthly VIP tuition payment of ₹${Math.round(contract.monthlyFee / 100)} is due by the 7th. Log in to your dashboard to pay.`,
                    link: "/vip/apply",
                },
            }).catch(() => {});

            // Notify tutor
            await prisma.notification.create({
                data: {
                    userId: contract.tutorId,
                    type: "VIP_PAYMENT",
                    title: "Monthly payment invoice sent",
                    body: `A payment of ₹${Math.round(contract.monthlyFee / 100)} has been invoiced to your student for this month.`,
                    link: "/dashboard/tutor?tab=VIP",
                },
            }).catch(() => {});

            created++;
        }

        return NextResponse.json({
            success: true,
            contractsProcessed: activeContracts.length,
            paymentsCreated: created,
            alreadyBilled: skipped,
            message: `VIP billing: ${created} invoices created, ${skipped} already billed this month`,
        });
    } catch (error) {
        console.error("VIP billing cron error:", error);
        return NextResponse.json({ error: "Failed to run VIP billing" }, { status: 500 });
    }
}
