-- CreateTable
CREATE TABLE "estrategia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estrategia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponderacion" (
    "id" SERIAL NOT NULL,
    "fondoId" INTEGER NOT NULL,
    "estrategiaId" INTEGER NOT NULL,
    "ponderacion" INTEGER NOT NULL,

    CONSTRAINT "ponderacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fondo" (
    "id" SERIAL NOT NULL,
    "tipo_fondo" TEXT NOT NULL,
    "riesgo" TEXT NOT NULL,
    "estrategia" TEXT NOT NULL,
    "disponibilidad" INTEGER NOT NULL,
    "plazo_minimo" INTEGER NOT NULL,
    "tipo_inversion" TEXT NOT NULL,

    CONSTRAINT "fondo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rendimiento" (
    "id" SERIAL NOT NULL,
    "limite_inferior" INTEGER NOT NULL,
    "limite_superior" INTEGER NOT NULL,
    "comision" DECIMAL(65,30) NOT NULL,
    "rendimiento" DECIMAL(65,30) NOT NULL,
    "fondoId" INTEGER NOT NULL,

    CONSTRAINT "rendimiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ponderacion" ADD CONSTRAINT "ponderacion_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "fondo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponderacion" ADD CONSTRAINT "ponderacion_estrategiaId_fkey" FOREIGN KEY ("estrategiaId") REFERENCES "estrategia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendimiento" ADD CONSTRAINT "rendimiento_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "fondo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
