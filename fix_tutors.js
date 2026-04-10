const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.listing.updateMany({
    data: {
      grades: ["Primary (1-5)", "Middle (6-8)", "High School (9-10)", "Higher Secondary (11-12)"]
    }
  });
  console.log("Updated tutor dummy profiles with grades.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
