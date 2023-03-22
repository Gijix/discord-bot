-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discord_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Gomette" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GometteToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GometteToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Gomette" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GometteToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "Gomette_name_key" ON "Gomette"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_GometteToUser_AB_unique" ON "_GometteToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GometteToUser_B_index" ON "_GometteToUser"("B");
