/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RegisterType" AS ENUM ('EMAIL', 'GOOGLE');

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "registerType" "RegisterType" NOT NULL DEFAULT 'EMAIL',
ALTER COLUMN "password" DROP NOT NULL;
