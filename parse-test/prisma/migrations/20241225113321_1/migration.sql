/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_category_id_fkey";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "posts";

-- DropEnum
DROP TYPE "UserRoles";

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "preview_image" TEXT,
    "images" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReviewsTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReviewsTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_title_key" ON "Reviews"("title");

-- CreateIndex
CREATE INDEX "_ReviewsTags_B_index" ON "_ReviewsTags"("B");

-- AddForeignKey
ALTER TABLE "_ReviewsTags" ADD CONSTRAINT "_ReviewsTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewsTags" ADD CONSTRAINT "_ReviewsTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
