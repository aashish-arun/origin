/*
  Warnings:

  - You are about to drop the `CollectionItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CollectibleStatus" AS ENUM ('OWNED', 'PLANNED', 'WISHLIST');

-- CreateEnum
CREATE TYPE "SeriesFormat" AS ENUM ('MANGA', 'ANIME', 'GAME', 'FILM', 'MUSIC', 'OTHER');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('WIKIPEDIA', 'OFFICIAL', 'FANDOM', 'OTHER');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('MINT', 'NEAR_MINT', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('OWNED', 'SOLD', 'GIFTED');

-- CreateEnum
CREATE TYPE "GalleryVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropTable
DROP TABLE "CollectionItem";

-- DropEnum
DROP TYPE "CollectionCategory";

-- DropEnum
DROP TYPE "ItemStatus";

-- CreateTable
CREATE TABLE "health_check" (
    "id" UUID NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "user_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtype" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subtype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "franchise_id" INTEGER,
    "icon_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_reference" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "type" "ReferenceType" NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "format" "SeriesFormat" NOT NULL,
    "total_units" INTEGER,
    "notes" TEXT,
    "franchise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collectible" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "status" "CollectibleStatus" NOT NULL DEFAULT 'OWNED',
    "brand_id" INTEGER,
    "category_id" INTEGER NOT NULL,
    "subtype_id" INTEGER NOT NULL,
    "franchise_id" INTEGER,
    "series_id" INTEGER,
    "character_id" INTEGER,
    "series_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collectible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edition" (
    "id" SERIAL NOT NULL,
    "collectible_id" INTEGER NOT NULL,
    "series_id" INTEGER,
    "edition_number" INTEGER,
    "edition_name" TEXT,
    "exclusive_label" TEXT,
    "release_date" TIMESTAMP(3),
    "edition_size" INTEGER,
    "sku" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase" (
    "id" SERIAL NOT NULL,
    "collectible_id" INTEGER NOT NULL,
    "edition_id" INTEGER,
    "condition" "Condition" NOT NULL,
    "status" "PurchaseStatus" NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL,
    "store_name" TEXT,
    "receipt_url" TEXT,
    "purchase_price" DECIMAL(10,2),
    "tax_amount" DECIMAL(10,2),
    "shipping_cost" DECIMAL(10,2),
    "total_cost" DECIMAL(10,2),
    "resale_date" TIMESTAMP(3),
    "resale_price" DECIMAL(10,2),
    "lot_id" INTEGER,
    "serial_number" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lot" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "collectible_id" INTEGER,
    "edition_id" INTEGER,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_image" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "image_url" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "visibility" "GalleryVisibility" NOT NULL DEFAULT 'PRIVATE',
    "uploaded_device" TEXT,
    "taken_year" INTEGER,
    "taken_month" INTEGER,
    "taken_day" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_image_tag" (
    "image_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "gallery_image_tag_pkey" PRIMARY KEY ("image_id","tag_id")
);

-- CreateTable
CREATE TABLE "gallery_share" (
    "id" SERIAL NOT NULL,
    "token" UUID NOT NULL,
    "title" TEXT,
    "created_by" UUID,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_share_image" (
    "share_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "gallery_share_image_pkey" PRIMARY KEY ("share_id","image_id")
);

-- CreateTable
CREATE TABLE "gallery_share_view" (
    "id" SERIAL NOT NULL,
    "share_id" INTEGER NOT NULL,
    "viewer_user_id" UUID,
    "viewer_email" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_share_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "subtype_category_id_idx" ON "subtype"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "subtype_name_category_id_key" ON "subtype"("name", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "franchise_name_key" ON "franchise"("name");

-- CreateIndex
CREATE INDEX "character_franchise_id_idx" ON "character"("franchise_id");

-- CreateIndex
CREATE UNIQUE INDEX "character_name_franchise_id_key" ON "character"("name", "franchise_id");

-- CreateIndex
CREATE INDEX "character_reference_character_id_idx" ON "character_reference"("character_id");

-- CreateIndex
CREATE INDEX "series_franchise_id_idx" ON "series"("franchise_id");

-- CreateIndex
CREATE UNIQUE INDEX "series_name_franchise_id_key" ON "series"("name", "franchise_id");

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_key" ON "brand"("name");

-- CreateIndex
CREATE INDEX "collectible_category_id_idx" ON "collectible"("category_id");

-- CreateIndex
CREATE INDEX "collectible_series_id_idx" ON "collectible"("series_id");

-- CreateIndex
CREATE INDEX "collectible_brand_id_idx" ON "collectible"("brand_id");

-- CreateIndex
CREATE INDEX "collectible_status_idx" ON "collectible"("status");

-- CreateIndex
CREATE INDEX "collectible_character_id_idx" ON "collectible"("character_id");

-- CreateIndex
CREATE INDEX "collectible_series_number_idx" ON "collectible"("series_number");

-- CreateIndex
CREATE INDEX "edition_collectible_id_idx" ON "edition"("collectible_id");

-- CreateIndex
CREATE INDEX "edition_series_id_idx" ON "edition"("series_id");

-- CreateIndex
CREATE INDEX "purchase_collectible_id_idx" ON "purchase"("collectible_id");

-- CreateIndex
CREATE INDEX "purchase_status_idx" ON "purchase"("status");

-- CreateIndex
CREATE INDEX "purchase_purchased_at_idx" ON "purchase"("purchased_at");

-- CreateIndex
CREATE INDEX "gallery_image_visibility_idx" ON "gallery_image"("visibility");

-- CreateIndex
CREATE INDEX "gallery_image_created_at_idx" ON "gallery_image"("created_at");

-- CreateIndex
CREATE INDEX "gallery_image_taken_year_taken_month_idx" ON "gallery_image"("taken_year", "taken_month");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_tag_name_key" ON "gallery_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_share_token_key" ON "gallery_share"("token");

-- CreateIndex
CREATE INDEX "gallery_share_view_share_id_idx" ON "gallery_share_view"("share_id");

-- CreateIndex
CREATE INDEX "gallery_share_view_viewed_at_idx" ON "gallery_share_view"("viewed_at");

-- AddForeignKey
ALTER TABLE "subtype" ADD CONSTRAINT "subtype_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character" ADD CONSTRAINT "character_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_reference" ADD CONSTRAINT "character_reference_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible" ADD CONSTRAINT "collectible_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible" ADD CONSTRAINT "collectible_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible" ADD CONSTRAINT "collectible_subtype_id_fkey" FOREIGN KEY ("subtype_id") REFERENCES "subtype"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible" ADD CONSTRAINT "collectible_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible" ADD CONSTRAINT "collectible_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible" ADD CONSTRAINT "collectible_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edition" ADD CONSTRAINT "edition_collectible_id_fkey" FOREIGN KEY ("collectible_id") REFERENCES "collectible"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edition" ADD CONSTRAINT "edition_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_collectible_id_fkey" FOREIGN KEY ("collectible_id") REFERENCES "collectible"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "edition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_collectible_id_fkey" FOREIGN KEY ("collectible_id") REFERENCES "collectible"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_image_tag" ADD CONSTRAINT "gallery_image_tag_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "gallery_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_image_tag" ADD CONSTRAINT "gallery_image_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "gallery_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_share_image" ADD CONSTRAINT "gallery_share_image_share_id_fkey" FOREIGN KEY ("share_id") REFERENCES "gallery_share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_share_image" ADD CONSTRAINT "gallery_share_image_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "gallery_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_share_view" ADD CONSTRAINT "gallery_share_view_share_id_fkey" FOREIGN KEY ("share_id") REFERENCES "gallery_share"("id") ON DELETE CASCADE ON UPDATE CASCADE;
