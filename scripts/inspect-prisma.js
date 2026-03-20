const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
    console.log("🔍 Inspecting Prisma Client Metadata...");
    try {
        // This is a hacky way to see what Prisma thinks are valid fields
        // by looking at the internal DMMF if possible, or just trying a query.
        
        console.log("Available models:", Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
        
        // Try to query Listing with subjects just to see the error locally in this process
        try {
            await prisma.listing.findFirst({
                where: {
                    subjects: { has: "Test" }
                }
            });
            console.log("✅ 'subjects' field is recognized locally.");
        } catch (e) {
            console.error("❌ 'subjects' field error:", e.message);
        }

        try {
            await prisma.listing.findFirst({
                where: {
                    grades: { has: "Test" }
                }
            });
            console.log("✅ 'grades' field is recognized locally.");
        } catch (e) {
            console.error("❌ 'grades' field error:", e.message);
        }

    } catch (err) {
        console.error("Critical inspection failure:", err);
    } finally {
        await prisma.$disconnect();
    }
}

inspect();
