-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_productOwnerUserId_fkey" FOREIGN KEY ("productOwnerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_projectManagerUserId_fkey" FOREIGN KEY ("projectManagerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
