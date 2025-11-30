/*
  Warnings:

  - You are about to drop the column `avaliacaoId` on the `Commentario` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Commentario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Commentario" DROP CONSTRAINT "Commentario_avaliacaoId_fkey";

-- AlterTable
ALTER TABLE "Commentario" DROP COLUMN "avaliacaoId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Commentario" ADD CONSTRAINT "Commentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
