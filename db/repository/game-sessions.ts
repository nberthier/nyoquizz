import { db } from '@/db';
import { gameSessions, InsertGameSession } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function deleteGameSession(userId: string, imagesSetId: string) {
  return await db
    .delete(gameSessions)
    .where(
      eq(gameSessions.userId, userId) &&
        eq(gameSessions.imagesSetId, imagesSetId)
    );
}

export async function findAllGameSessions() {
  return await db.query.gameSessions.findMany({
    orderBy: (gameSession, { asc }) => [asc(gameSession.createdAt)],
  });
}

export async function findGameSessionByCompositePK(
  userId: string,
  imagesSetId: string
) {
  return await db.query.gameSessions.findFirst({
    where: (gameSession) =>
      eq(gameSession.userId, userId) &&
      eq(gameSession.imagesSetId, imagesSetId),
  });
}

export async function insertGameSession(gameSession: InsertGameSession) {
  return await db
    .insert(gameSessions)
    .values({ ...gameSession, createdAt: Date.now() })
    .returning();
}

export async function updateGameSessionProgression(
  userId: string,
  imagesSetId: string
) {
  return await db
    .update(gameSessions)
    .set({
      progression: sql`${gameSessions.progression} + 1`,
      updatedAt: Date.now(),
    })
    .where(
      eq(gameSessions.userId, userId) &&
        eq(gameSessions.imagesSetId, imagesSetId)
    )
    .returning({ updatedProgression: gameSessions.progression });
}
