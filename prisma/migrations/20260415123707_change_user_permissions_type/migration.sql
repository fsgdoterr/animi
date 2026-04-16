/*
  Warnings:

  - Changed the column `permissions` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "User"
ALTER COLUMN "permissions" DROP DEFAULT;

ALTER TABLE "User"
ALTER COLUMN "permissions" TYPE "UserPermissions"[]
USING ARRAY["permissions"];

ALTER TABLE "User"
ALTER COLUMN "permissions" SET DEFAULT ARRAY['USER'::"UserPermissions"];