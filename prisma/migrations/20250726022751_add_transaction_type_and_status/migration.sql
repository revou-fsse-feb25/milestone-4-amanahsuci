/*
  Warnings:

  - Added the required column `accountType` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- ENUMS
CREATE TYPE "AccountType" AS ENUM ('SAVING', 'DEPOSIT', 'CHECKING');
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER');
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'FAILED', 'PENDING');

-- Alter Table
ALTER TABLE "Account"
  ADD COLUMN "accountType" "AccountType" NOT NULL DEFAULT 'CHECKING';

-- Alter Table
ALTER TABLE "Transaction"
  ALTER COLUMN "type" TYPE "TransactionType"
  USING "type"::text::"TransactionType";

-- Alter Table
ALTER TABLE "Transaction"
  ALTER COLUMN "status" DROP DEFAULT;

-- Alter Table
ALTER TABLE "Transaction"
  ALTER COLUMN "status" TYPE "TransactionStatus"
  USING "status"::text::"TransactionStatus";
