/*
  Warnings:

  - Added the required column `iceCreamSelection` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `iceCreamSelection` VARCHAR(191) NOT NULL;
