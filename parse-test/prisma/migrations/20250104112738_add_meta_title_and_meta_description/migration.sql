/*
  Warnings:

  - You are about to drop the `ParsedTitles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `meta_description` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_title` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_description` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta_title` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "meta_description" TEXT NOT NULL,
ADD COLUMN     "meta_title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "meta_description" TEXT NOT NULL,
ADD COLUMN     "meta_title" TEXT NOT NULL;

-- DropTable
DROP TABLE "ParsedTitles";

-- CreateTable
CREATE TABLE "NewsParsedTitles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "NewsParsedTitles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewsParsedTitles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ReviewsParsedTitles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsParsedTitles_title_key" ON "NewsParsedTitles"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewsParsedTitles_title_key" ON "ReviewsParsedTitles"("title");
