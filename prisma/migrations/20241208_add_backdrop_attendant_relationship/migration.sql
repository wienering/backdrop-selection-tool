-- CreateTable
CREATE TABLE "backdrop_attendants" (
    "id" TEXT NOT NULL,
    "backdropId" TEXT NOT NULL,
    "attendantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backdrop_attendants_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data from backdrops.attendantId to backdrop_attendants
INSERT INTO "backdrop_attendants" ("id", "backdropId", "attendantId", "createdAt")
SELECT 
    gen_random_uuid() as "id",
    "id" as "backdropId", 
    "attendantId", 
    "createdAt"
FROM "backdrops" 
WHERE "attendantId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "backdrop_attendants_backdropId_attendantId_key" ON "backdrop_attendants"("backdropId", "attendantId");

-- AddForeignKey
ALTER TABLE "backdrop_attendants" ADD CONSTRAINT "backdrop_attendants_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backdrop_attendants" ADD CONSTRAINT "backdrop_attendants_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "backdrops" DROP CONSTRAINT "backdrops_attendantId_fkey";

-- DropIndex
DROP INDEX "backdrops_attendantId_key";

-- AlterTable
ALTER TABLE "backdrops" DROP COLUMN "attendantId";
