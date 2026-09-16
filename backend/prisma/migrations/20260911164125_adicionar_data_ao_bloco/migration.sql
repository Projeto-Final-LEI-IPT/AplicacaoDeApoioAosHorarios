/*
  Warnings:

  - Added the required column `data` to the `Bloco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bloco" ADD COLUMN     "data" DATE NOT NULL;
