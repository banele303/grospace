-- Modified version of the migration that adds userId as nullable first
-- Then associates vendors with users (if needed)
-- Then makes userId non-nullable

-- First, add the userId column as nullable
ALTER TABLE "Vendor" ADD COLUMN "userId" TEXT;

-- Create index (but don't enforce uniqueness yet)
CREATE INDEX "Vendor_userId_idx" ON "Vendor"("userId");

-- Here you would add SQL to associate vendors with users
-- For example, you could create users for each vendor without a user

-- After setting up users, make userId non-nullable and unique
-- ALTER TABLE "Vendor" ALTER COLUMN "userId" SET NOT NULL;
-- ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_key" UNIQUE ("userId");
-- ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Note: Uncomment the above constraints after ensuring all vendors have valid user associations
