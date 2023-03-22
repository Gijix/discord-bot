/*
  Warnings:

  - You are about to drop the `_GometteToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `image_url` on the `Gomette` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Gomette` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_GometteToUser_B_index";

-- DropIndex
DROP INDEX "_GometteToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GometteToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserGomettes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gometteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "UserGomettes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserGomettes_gometteId_fkey" FOREIGN KEY ("gometteId") REFERENCES "Gomette" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gomette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);
INSERT INTO "new_Gomette" ("id", "name") SELECT "id", "name" FROM "Gomette";
DROP TABLE "Gomette";
ALTER TABLE "new_Gomette" RENAME TO "Gomette";
CREATE UNIQUE INDEX "Gomette_name_key" ON "Gomette"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
