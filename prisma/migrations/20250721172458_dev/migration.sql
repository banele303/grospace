/*
  Warnings:

  - You are about to drop the column `amount` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('seeds', 'produce', 'livestock', 'equipment', 'fertilizer', 'organic', 'services');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount",
ADD COLUMN     "total" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "vendorId" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory" NOT NULL;

-- DropEnum
DROP TYPE "CampaignStatus";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "RecipientStatus";

-- CreateTable
CREATE TABLE "FarmLocation" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "FarmLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "bio" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "farmLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_farmLocationId_fkey" FOREIGN KEY ("farmLocationId") REFERENCES "FarmLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
