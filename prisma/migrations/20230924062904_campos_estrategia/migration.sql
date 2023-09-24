/*
  Warnings:

  - Added the required column `monto_inicial` to the `estrategia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto_mensual` to the `estrategia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiempo_retorno` to the `estrategia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "estrategia" ADD COLUMN     "monto_inicial" INTEGER NOT NULL,
ADD COLUMN     "monto_mensual" INTEGER NOT NULL,
ADD COLUMN     "tiempo_retorno" INTEGER NOT NULL;
