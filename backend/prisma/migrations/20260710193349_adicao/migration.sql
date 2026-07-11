/*
  Warnings:

  - A unique constraint covering the columns `[user_password]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_user_password_key" ON "user"("user_password");
