'use server';

import { drizzle } from '@/db';
import { InsertGameSession } from '@/db/schema';

export async function createOne(imagesSetUserStat: InsertGameSession) {
  return await drizzle.gameSessions.insertGameSession(imagesSetUserStat);
}

export async function getByUserAndImagesSet(
  userId: string,
  imagesSetId: string
) {
  return await drizzle.gameSessions.findGameSessionByCompositePK(
    userId,
    imagesSetId
  );
}

export async function updateProgression(userId: string, imagesSetId: string) {
  return await drizzle.gameSessions.updateGameSessionProgression(
    userId,
    imagesSetId
  );
}
