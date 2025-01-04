/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `ParsedTitles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParsedTitles_title_key" ON "ParsedTitles"("title");
