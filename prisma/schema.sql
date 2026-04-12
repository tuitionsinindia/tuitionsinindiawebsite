-- Tuitions In India — Full Database Schema
-- Run with: cat prisma/schema.sql | ssh root@187.77.188.36 "docker exec -i tuitionsinindia-db psql -U tuitions_admin -d tuitionsinindia"

-- ENUMS
DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'INSTITUTE', 'ADMIN'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "AdType" AS ENUM ('BANNER', 'SEARCH_TOP', 'SIDEBAR'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'ELITE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "LeadStatus" AS ENUM ('OPEN', 'CLOSED', 'CLOSED_STUDENT', 'CLOSED_ADMIN'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "ListingType" AS ENUM ('PRIVATE', 'GROUP'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "LeadType" AS ENUM ('ACADEMIC', 'RECRUITMENT'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- TABLES
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "privacySettings" JSONB DEFAULT '{"showPhonePublicly": true, "preferredContact": "PHONE"}',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isIdVerified" BOOLEAN NOT NULL DEFAULT false,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "subscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "User_subscriptionId_key" ON "User"("subscriptionId");

CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "subjects" TEXT[] NOT NULL DEFAULT '{}',
    "grades" TEXT[] NOT NULL DEFAULT '{}',
    "locations" TEXT[] NOT NULL DEFAULT '{}',
    "hourlyRate" INTEGER,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boards" TEXT[] NOT NULL DEFAULT '{}',
    "experience" INTEGER,
    "gender" TEXT,
    "teachingModes" TEXT[] NOT NULL DEFAULT '{}',
    "timings" TEXT[] NOT NULL DEFAULT '{}',
    "languages" TEXT[] NOT NULL DEFAULT '{}',
    "expertiseLevel" TEXT,
    "type" "ListingType" NOT NULL DEFAULT 'PRIVATE',
    "maxSeats" INTEGER DEFAULT 1,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "isInstitute" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Listing_tutorId_key" ON "Listing"("tutorId");

CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjects" TEXT[] NOT NULL DEFAULT '{}',
    "grades" TEXT[] NOT NULL DEFAULT '{}',
    "locations" TEXT[] NOT NULL DEFAULT '{}',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "budget" INTEGER,
    "budgetMax" INTEGER,
    "modes" TEXT[] NOT NULL DEFAULT '{}',
    "boards" TEXT[] NOT NULL DEFAULT '{}',
    "timings" TEXT[] NOT NULL DEFAULT '{}',
    "genderPreference" TEXT,
    "description" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumTier" INTEGER NOT NULL DEFAULT 0,
    "maxUnlocks" INTEGER NOT NULL DEFAULT 5,
    "unlockCount" INTEGER NOT NULL DEFAULT 0,
    "status" "LeadStatus" NOT NULL DEFAULT 'OPEN',
    "type" "LeadType" NOT NULL DEFAULT 'ACADEMIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "LeadUnlock" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeadUnlock_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LeadUnlock_leadId_tutorId_key" ON "LeadUnlock"("leadId", "tutorId");

CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "authorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "timings" TEXT[] NOT NULL DEFAULT '{}',
    "maxSeats" INTEGER DEFAULT 20,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AdSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AdType" NOT NULL,
    "imageUrl" TEXT,
    "targetUrl" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_razorpayOrderId_key" ON "Transaction"("razorpayOrderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_razorpayPaymentId_key" ON "Transaction"("razorpayPaymentId");

CREATE TABLE IF NOT EXISTS "ChatSession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ChatSession_studentId_tutorId_key" ON "ChatSession"("studentId", "tutorId");

CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- FOREIGN KEYS
ALTER TABLE "Listing" DROP CONSTRAINT IF EXISTS "Listing_tutorId_fkey";
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Lead" DROP CONSTRAINT IF EXISTS "Lead_studentId_fkey";
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadUnlock" DROP CONSTRAINT IF EXISTS "LeadUnlock_leadId_fkey";
ALTER TABLE "LeadUnlock" ADD CONSTRAINT "LeadUnlock_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadUnlock" DROP CONSTRAINT IF EXISTS "LeadUnlock_tutorId_fkey";
ALTER TABLE "LeadUnlock" ADD CONSTRAINT "LeadUnlock_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_authorId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON UPDATE CASCADE;

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_targetId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON UPDATE CASCADE;

ALTER TABLE "Course" DROP CONSTRAINT IF EXISTS "Course_instituteId_fkey";
ALTER TABLE "Course" ADD CONSTRAINT "Course_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AdSlot" DROP CONSTRAINT IF EXISTS "AdSlot_userId_fkey";
ALTER TABLE "AdSlot" ADD CONSTRAINT "AdSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_userId_fkey";
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON UPDATE CASCADE;

ALTER TABLE "ChatSession" DROP CONSTRAINT IF EXISTS "ChatSession_studentId_fkey";
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON UPDATE CASCADE;

ALTER TABLE "ChatSession" DROP CONSTRAINT IF EXISTS "ChatSession_tutorId_fkey";
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON UPDATE CASCADE;

ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_senderId_fkey";
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON UPDATE CASCADE;

ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_sessionId_fkey";
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
