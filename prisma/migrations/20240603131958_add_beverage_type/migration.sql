/*
  Warnings:

  - Added the required column `type` to the `Beverage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Beverage` ADD COLUMN `type` ENUM('COCKTAIL', 'WINE', 'SODA', 'BEER') NOT NULL;
