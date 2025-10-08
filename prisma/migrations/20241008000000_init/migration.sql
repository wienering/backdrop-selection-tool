-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backdrops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "publicStatus" BOOLEAN NOT NULL DEFAULT true,
    "attendantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "backdrops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backdrop_images" (
    "id" TEXT NOT NULL,
    "backdropId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backdrop_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "backdropId" TEXT NOT NULL,
    "attendantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "attendants_email_key" ON "attendants"("email");

-- AddForeignKey
ALTER TABLE "backdrops" ADD CONSTRAINT "backdrops_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backdrop_images" ADD CONSTRAINT "backdrop_images_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
