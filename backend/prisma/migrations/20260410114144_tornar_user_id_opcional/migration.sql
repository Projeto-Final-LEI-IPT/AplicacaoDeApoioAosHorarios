-- DropForeignKey
ALTER TABLE "Docente" DROP CONSTRAINT "Docente_userId_fkey";

-- AlterTable
ALTER TABLE "Docente" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
