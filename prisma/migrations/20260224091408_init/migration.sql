/*
  Warnings:

  - You are about to drop the column `validade` on the `carteira` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "carteira" DROP COLUMN "validade",
ADD COLUMN     "expiraEm" TIMESTAMP(3);
