/*
  Warnings:

  - You are about to drop the column `connectionString` on the `DBCredentials` table. All the data in the column will be lost.
  - Added the required column `host` to the `DBCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `DBCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `DBCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `port` to the `DBCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `DBCredentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DBCredentials" DROP COLUMN "connectionString",
ADD COLUMN     "host" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "port" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
