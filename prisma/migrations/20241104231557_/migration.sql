-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "prefix" TEXT,
    "logCanalId" TEXT,
    "local" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserLovense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lovenseToyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserLovense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserLovenseConnect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userLovenseId" TEXT NOT NULL,
    "connectedUserLovenseId" TEXT NOT NULL,
    CONSTRAINT "UserLovenseConnect_userLovenseId_fkey" FOREIGN KEY ("userLovenseId") REFERENCES "UserLovense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserLovenseConnect_connectedUserLovenseId_fkey" FOREIGN KEY ("connectedUserLovenseId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_guildId_key" ON "Guild"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLovense_lovenseToyId_key" ON "UserLovense"("lovenseToyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLovense_userId_key" ON "UserLovense"("userId");
