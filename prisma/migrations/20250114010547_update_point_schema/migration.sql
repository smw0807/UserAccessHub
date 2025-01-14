/*
  Warnings:

  - Added the required column `pointId` to the `TB_POINT_HISTORY` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TB_POINT_HISTORY" DROP CONSTRAINT "TB_POINT_HISTORY_id_fkey";

-- AlterTable
ALTER TABLE "TB_POINT_HISTORY" ADD COLUMN     "pointId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TB_POINT_HISTORY" ADD CONSTRAINT "TB_POINT_HISTORY_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "TB_POINT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
