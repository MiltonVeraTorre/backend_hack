/*
  Warnings:

  - Added the required column `rendimiento_anual` to the `estrategia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riesgo` to the `estrategia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "estrategia" ADD COLUMN     "rendimiento_anual" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "riesgo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "grafica" (
    "id" SERIAL NOT NULL,
    "label" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "estrategiaId" INTEGER NOT NULL,

    CONSTRAINT "grafica_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grafica" ADD CONSTRAINT "grafica_estrategiaId_fkey" FOREIGN KEY ("estrategiaId") REFERENCES "estrategia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
