const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log("🔍 Diagnosing Database Connection...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.split('@')[1] || "Not found or hidden");

  try {
    // Attempt to connect and run a simple query
    const start = Date.now();
    await prisma.$connect();
    console.log(`✅ Prisma connected in ${Date.now() - start}ms`);
    
    const userCount = await prisma.user.count();
    console.log(`✅ Success! Found ${userCount} users in the database.`);
  } catch (err) {
    console.error("\n❌ CONNECTION ERROR DETECTED:");
    console.error("Code:", err.code);
    console.error("Message:", err.message);

    if (err.message.includes("fetch failed")) {
      console.log("\n💡 ANALYSIS: This is a 'Service Fetch' failure.");
      console.log("It means your local Prisma Postgres proxy is NOT running.");
      console.log("FIX: Run 'npx prisma dev' in a separate terminal and keep it open.");
    } else if (err.code === 'P1001') {
      console.log("\n💡 ANALYSIS: Can't reach database server.");
      console.log("FIX: Ensure your Docker container is running or check the port in .env");
    }
  } finally {
    await prisma.$disconnect();
  }
}

check();
