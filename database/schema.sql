- ResolveIt Database Schema
-- This schema is for reference. The canonical source of truth is `backend/prisma/schema.prisma`.

-- Role enumeration for users
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Case Type enumeration
CREATE TYPE "CaseType" AS ENUM ('FAMILY', 'BUSINESS', 'CRIMINAL', 'COMMUNITY', 'OTHER');

-- Case Status enumeration
CREATE TYPE "CaseStatus" AS ENUM (
  'REGISTERED',
  'AWAITING_RESPONSE',
  'ACCEPTED',
  'PANEL_CREATED',
  'MEDIATION_IN_PROGRESS',
  'RESOLVED',
  'UNRESOLVED',
  'REJECTED'
);

-- Evidence File Type enumeration
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- Panel Member Type enumeration
CREATE TYPE "PanelMemberType" AS ENUM ('LAWYER', 'SCHOLAR', 'CIVIL');

-- User Table: Stores information for both regular users (parties) and admins.
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "age" INTEGER,
  "gender" VARCHAR(50),
  "photo_url" TEXT,
  "address_street" TEXT,
  "address_city" TEXT,
  "address_zip" VARCHAR(20),
  "role" "Role" NOT NULL DEFAULT 'USER',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Case Table: The central table for storing dispute information.
CREATE TABLE "Case" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "case_type" "CaseType" NOT NULL,
  "description" TEXT NOT NULL,
  "is_pending_in_court" BOOLEAN NOT NULL DEFAULT false,
  "case_number" VARCHAR(255),
  "institution_name" VARCHAR(255),
  "status" "CaseStatus" NOT NULL DEFAULT 'REGISTERED',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Case_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Opposite Party Table: Stores details of the other party in a dispute.
CREATE TABLE "OppositeParty" (
  "id" SERIAL PRIMARY KEY,
  "case_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "phone" VARCHAR(50),
  "address" TEXT,
  "notified" BOOLEAN NOT NULL DEFAULT false,
  "agreed_to_mediate" BOOLEAN,
  "responded_at" TIMESTAMP(3),
  CONSTRAINT "OppositeParty_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Evidence Table: Stores links to uploaded files for each case.
CREATE TABLE "Evidence" (
  "id" SERIAL PRIMARY KEY,
  "case_id" INTEGER NOT NULL,
  "file_type" "FileType" NOT NULL,
  "file_url" TEXT NOT NULL,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Evidence_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Panel Members Table: Stores information about the mediation panel for a case.
CREATE TABLE "PanelMember" (
  "id" SERIAL PRIMARY KEY,
  "case_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "type" "PanelMemberType" NOT NULL,
  "email" VARCHAR(255),
  "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PanelMember_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Witness Table: Stores information about witnesses for a case.
CREATE TABLE "Witness" (
  "id" SERIAL PRIMARY KEY,
  "case_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "phone" VARCHAR(50),
  "nominated_by" VARCHAR(50) NOT NULL, -- 'user' or 'opposite'
  CONSTRAINT "Witness_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for frequently queried columns
CREATE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_case_status" ON "Case"("status");
CREATE INDEX "idx_case_user_id" ON "Case"("user_id");
CREATE INDEX "idx_oppositeparty_case_id" ON "OppositeParty"("case_id");
