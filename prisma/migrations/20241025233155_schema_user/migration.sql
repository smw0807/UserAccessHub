-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SIGN_UP_TYPE" AS ENUM ('EMAIL', 'KAKAO', 'GOOGLE');

-- CreateTable
CREATE TABLE "TB_USER" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "type" "SIGN_UP_TYPE" NOT NULL DEFAULT 'EMAIL',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "profileImage" TEXT,
    "phoneNumber" TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TB_USER_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TB_USER_email_key" ON "TB_USER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TB_USER_phoneNumber_key" ON "TB_USER"("phoneNumber");
