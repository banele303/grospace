/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUYER', 'VENDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductCategory" ADD VALUE 'grains';
ALTER TYPE "ProductCategory" ADD VALUE 'fruits';
ALTER TYPE "ProductCategory" ADD VALUE 'vegetables';
ALTER TYPE "ProductCategory" ADD VALUE 'herbs';
ALTER TYPE "ProductCategory" ADD VALUE 'dairy';
ALTER TYPE "ProductCategory" ADD VALUE 'meat';
ALTER TYPE "ProductCategory" ADD VALUE 'poultry';
ALTER TYPE "ProductCategory" ADD VALUE 'fish';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "harvestDate" TIMESTAMP(3),
ADD COLUMN     "nutritionalInfo" JSONB,
ADD COLUMN     "organic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "seasonality" TEXT,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'BUYER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "deliveryRadius" INTEGER,
ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "minimumOrder" INTEGER,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "VendorEarning" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorEarning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VendorEarning_vendorId_idx" ON "VendorEarning"("vendorId");

-- CreateIndex
CREATE INDEX "VendorEarning_status_idx" ON "VendorEarning"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorEarning" ADD CONSTRAINT "VendorEarning_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
