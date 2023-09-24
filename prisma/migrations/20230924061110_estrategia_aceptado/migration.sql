/*
  Warnings:

  - You are about to drop the column `aceptado` on the `ponderacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "estrategia" ADD COLUMN     "aceptado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ponderacion" DROP COLUMN "aceptado";
