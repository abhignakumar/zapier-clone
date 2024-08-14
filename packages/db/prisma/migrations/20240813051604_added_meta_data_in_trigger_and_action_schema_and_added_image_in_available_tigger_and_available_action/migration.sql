/*
  Warnings:

  - You are about to drop the column `metadata` on the `ZapRun` table. All the data in the column will be lost.
  - Added the required column `image` to the `AvailableAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `AvailableTrigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "metaData" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "AvailableAction" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvailableTrigger" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "metaData" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "ZapRun" DROP COLUMN "metadata",
ADD COLUMN     "metaData" JSONB NOT NULL DEFAULT '{}';
