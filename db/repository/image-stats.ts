import { db } from '@/db';
import { imageStats, InsertImageStat } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteImageStat(id: string) {
  return await db.delete(imageStats).where(eq(imageStats.id, id));
}

export async function findAllImageStats() {
  return await db.query.imageStats.findMany();
}

export async function findImageStatByConstraint(
  userId: string,
  imageId: string
) {
  return await db.query.imageStats.findFirst({
    where: (imageStat) =>
      eq(imageStat.id, userId) && eq(imageStat.imageId, imageId),
  });
}

export async function findImageStatById(id: string) {
  return await db.query.imageStats.findFirst({
    where: (imageStat) => eq(imageStat.id, id),
  });
}

export async function findImageStatsByUserId(userId: string) {
  return await db.query.imageStats.findMany({
    orderBy: (imageStat, { asc }) => [asc(imageStat.createdAt)],
    where: (imageStat) => eq(imageStat.userId, userId),
  });
}

export async function findImageStatsHistoryByUserId(userId: string) {
  return await db.query.imageStats.findMany({
    orderBy: (imageStat, { desc }) => [desc(imageStat.createdAt)],
    where: (imageStat) => eq(imageStat.userId, userId),
    with: {
      image: true,
    },
  });
}

export async function insertImageStat(imageStat: InsertImageStat) {
  return await db
    .insert(imageStats)
    .values({ ...imageStat, createdAt: Date.now() })
    .returning();
}

export async function resolveImageStat(id: string) {
  return await db
    .update(imageStats)
    .set({ isResolved: true, updatedAt: Date.now() })
    .where(eq(imageStats.id, id))
    .returning();
}

export async function updateImageStatNumberOfTries(
  id: string,
  numberOfTries: number
) {
  return await db
    .update(imageStats)
    .set({ numberOfTries, updatedAt: Date.now() })
    .where(eq(imageStats.id, id))
    .returning({ updatedAge: imageStats.numberOfTries });
}
