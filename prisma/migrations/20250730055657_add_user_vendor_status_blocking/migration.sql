-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountStatus" "UserStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "blockedAt" TIMESTAMP(3),
ADD COLUMN     "blockedReason" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "blockedAt" TIMESTAMP(3),
ADD COLUMN     "blockedReason" TEXT,
ADD COLUMN     "vendorStatus" "VendorStatus" NOT NULL DEFAULT 'PENDING';
