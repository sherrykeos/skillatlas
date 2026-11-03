-- CreateEnum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SkillSourceType') THEN
        CREATE TYPE "SkillSourceType" AS ENUM ('MANUAL', 'GITHUB');
    END IF;
END $$;

-- AlterTable Skill
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "sourceType" "SkillSourceType" NOT NULL DEFAULT 'MANUAL';
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;

-- AlterTable SkillVersion
ALTER TABLE "SkillVersion" ADD COLUMN IF NOT EXISTS "sourceBranch" TEXT;
ALTER TABLE "SkillVersion" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

-- AlterTable SkillFile
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'SkillFile' AND column_name = 'miniType'
    ) AND NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'SkillFile' AND column_name = 'mimeType'
    ) THEN
        ALTER TABLE "SkillFile" RENAME COLUMN "miniType" TO "mimeType";
    END IF;
END $$;

-- CreateIndex Review
CREATE UNIQUE INDEX IF NOT EXISTS "Review_userId_skillId_key" ON "Review"("userId", "skillId");

