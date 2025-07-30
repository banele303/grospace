-- DropIndex
DROP INDEX "Vendor_userId_key";

-- AlterTable
ALTER TABLE "ProductView" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "referrer" TEXT;
