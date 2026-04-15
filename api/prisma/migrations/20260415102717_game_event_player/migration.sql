/*
  Warnings:

  - You are about to drop the `EventPlayer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventPlayer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "GameEventPlayer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GameEventPlayer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "GameEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameEventPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GameEventPlayer_eventId_playerId_key" ON "GameEventPlayer"("eventId", "playerId");
