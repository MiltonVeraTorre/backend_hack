/*
  Warnings:

  - Added the required column `nombre` to the `fondo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fondo" ADD COLUMN     "nombre" TEXT NOT NULL;
