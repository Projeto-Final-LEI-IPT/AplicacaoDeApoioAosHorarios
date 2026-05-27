-- CreateTable
CREATE TABLE "FeriadoLocal" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeriadoLocal_pkey" PRIMARY KEY ("id")
);
