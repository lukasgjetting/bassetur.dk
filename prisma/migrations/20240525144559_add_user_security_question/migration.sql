/*
  Warnings:

  - Added the required column `securityQuestion` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityQuestionAnswer` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityQuestionAnswerOptions` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `securityQuestion` TEXT NOT NULL,
    ADD COLUMN `securityQuestionAnswer` VARCHAR(191) NOT NULL,
    ADD COLUMN `securityQuestionAnswerOptions` VARCHAR(191) NOT NULL;
