-- CreateTable
CREATE TABLE "reservable" (
    "id" SERIAL NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "init_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "quota" INTEGER NOT NULL,

    CONSTRAINT "reservable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" SERIAL NOT NULL,
    "reservableId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reservation_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservable" ADD CONSTRAINT "reservable_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_reservableId_fkey" FOREIGN KEY ("reservableId") REFERENCES "reservable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
