import { db } from '@/db';
import { InsertImageStat } from '@/db/schema';
import { imageStats } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function deleteImageStat(id: string) {
  return await db.delete(imageStats).where(eq(imageStats.id, id));
}

export async function findAllImageStats() {
  return await db.query.imageStats.findMany();
}

export async function findImageStatById(id: string) {
  return await db.query.imageStats.findFirst({
    where: (imageStats) => eq(imageStats.id, id),
  });
}

export async function findImageStatsByUserId(userId: string) {
  return await db.query.imageStats.findMany({
    where: (imageStats) => eq(imageStats.userId, userId),
  });
}

export async function insertImageStat(imageStat: InsertImageStat) {
  return await db.insert(imageStats).values(imageStat);
}

export async function updateImageStatNumberOfTries(
  id: string,
  numberOfTries: number
) {
  return await db
    .update(imageStats)
    .set({ numberOfTries, updatedAt: sql`NOW()` })
    .where(eq(imageStats.id, id))
    .returning({ updatedAge: imageStats.numberOfTries });
}
