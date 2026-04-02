-- CreateEnum
CREATE TYPE "CollectionCategory" AS ENUM ('ANIME', 'GAMES', 'MANGA', 'BOOKS', 'HOTWHEELS', 'OTHER');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('OWNED', 'WISHLIST', 'ARCHIVED');

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "CollectionCategory" NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'OWNED',
    "imageUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_slug_key" ON "CollectionItem"("slug");
