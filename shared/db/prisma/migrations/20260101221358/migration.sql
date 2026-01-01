/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "usernameSlug" TEXT,
    "publicKey" TEXT NOT NULL,
    "avatar" TEXT,
    "referralCode" TEXT,
    "referralCodeSlug" TEXT,
    "referralBasisPoints" INTEGER NOT NULL DEFAULT 25,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isChatModerator" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "hasReadSideBetRules" BOOLEAN NOT NULL DEFAULT false,
    "canUpdateProfile" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_publicKey_key" ON "user"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "user_referralCode_key" ON "user"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_referralCodeSlug_key" ON "user"("referralCodeSlug");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
