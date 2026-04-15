/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChallengeInstance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "challengeId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChallengeInstance_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChallengeInstance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "GameEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChallengeInstance" ("challengeId", "createdAt", "eventId", "id", "updatedAt") SELECT "challengeId", "createdAt", "eventId", "id", "updatedAt" FROM "ChallengeInstance";
DROP TABLE "ChallengeInstance";
ALTER TABLE "new_ChallengeInstance" RENAME TO "ChallengeInstance";
CREATE TABLE "new_EventPlayer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventPlayer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "GameEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EventPlayer" ("createdAt", "eventId", "id", "playerId", "updatedAt") SELECT "createdAt", "eventId", "id", "playerId", "updatedAt" FROM "EventPlayer";
DROP TABLE "EventPlayer";
ALTER TABLE "new_EventPlayer" RENAME TO "EventPlayer";
CREATE UNIQUE INDEX "EventPlayer_eventId_playerId_key" ON "EventPlayer"("eventId", "playerId");
CREATE TABLE "new_PlayerAttributeScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlayerAttributeScore_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerAttributeScore_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerAttributeScore_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "GameEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerAttributeScore" ("attributeId", "createdAt", "eventId", "id", "playerId", "score", "updatedAt") SELECT "attributeId", "createdAt", "eventId", "id", "playerId", "score", "updatedAt" FROM "PlayerAttributeScore";
DROP TABLE "PlayerAttributeScore";
ALTER TABLE "new_PlayerAttributeScore" RENAME TO "PlayerAttributeScore";
CREATE UNIQUE INDEX "PlayerAttributeScore_playerId_attributeId_eventId_key" ON "PlayerAttributeScore"("playerId", "attributeId", "eventId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
