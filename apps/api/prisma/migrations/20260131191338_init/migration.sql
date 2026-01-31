-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('JOB_SEEKER', 'EMPLOYED', 'STUDENT', 'SELF_EMPLOYED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "UserBenefitStatus" AS ENUM ('BOOKMARKED', 'PREPARING', 'APPLIED', 'RECEIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "employment_status" "EmploymentStatus" NOT NULL,
    "is_self_employed" BOOLEAN NOT NULL DEFAULT false,
    "notification_channel" "NotificationChannel" NOT NULL DEFAULT 'EMAIL',
    "notification_enabled" BOOLEAN NOT NULL DEFAULT true,
    "notification_lead_days" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "agency" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "amount" VARCHAR(100) NOT NULL,
    "apply_start_date" DATE NOT NULL,
    "apply_end_date" DATE NOT NULL,
    "deadline" DATE NOT NULL,
    "application_link" VARCHAR(500) NOT NULL,
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "documents" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_benefits" (
    "user_id" TEXT NOT NULL,
    "benefit_id" TEXT NOT NULL,
    "status" "UserBenefitStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_benefits_pkey" PRIMARY KEY ("user_id","benefit_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "benefits_deadline_idx" ON "benefits"("deadline");

-- CreateIndex
CREATE INDEX "benefits_region_category_idx" ON "benefits"("region", "category");

-- CreateIndex
CREATE INDEX "user_benefits_user_id_status_idx" ON "user_benefits"("user_id", "status");

-- AddForeignKey
ALTER TABLE "user_benefits" ADD CONSTRAINT "user_benefits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_benefits" ADD CONSTRAINT "user_benefits_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
