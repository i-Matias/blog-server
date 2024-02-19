/*
  Warnings:

  - A unique constraint covering the columns `[tag_name]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tags_tag_name_key` ON `tags`(`tag_name`);
