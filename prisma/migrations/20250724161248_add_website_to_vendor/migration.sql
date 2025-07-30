-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "maxOrderQuantity" INTEGER,
ADD COLUMN     "minOrderQuantity" INTEGER;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "farmSize" TEXT,
ADD COLUMN     "farmingType" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
