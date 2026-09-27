-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('OPENAI', 'ANTHROPIC', 'GEMINI');

-- CreateTable
CREATE TABLE "AiProvider" (
    "id" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "name" TEXT NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "keyPreview" TEXT NOT NULL,
    "defaultModel" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiProvider_pkey" PRIMARY KEY ("id")
);
