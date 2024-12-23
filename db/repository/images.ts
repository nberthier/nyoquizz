import { db } from '@/db';
import { images, InsertImage } from '@/db/schema';
import { eq, isNull, sql } from 'drizzle-orm';

export async function deleteImage(id: string) {
  return await db.delete(images).where(eq(images.id, id));
}

export async function findAllImages() {
  return await db.query.images.findMany();
}

export async function findImageById(id: string) {
  return await db.query.images.findFirst({
    where: (images) => eq(images.id, id),
  });
}

export async function findImagesByGame(game: string) {
  return await db.query.images.findMany({
    where: (images) => eq(images.game, game),
  });
}

export async function getTenRandomImages(game: string) {
  return await db
    .select()
    .from(images)
    .where(eq(images.game, game) && isNull(images.imagesSetId))
    .orderBy(sql`RANDOM()`)
    .limit(10);
}

export async function insertImage(image: InsertImage) {
  return await db
    .insert(images)
    .values({ ...image, createdAt: Date.now() })
    .returning();
}

export async function linkToImagesSet(
  id: string,
  imagesSetId: string,
  indexInSet: number
) {
  return await db
    .update(images)
    .set({ imagesSetId, indexInSet, updatedAt: Date.now() })
    .where(eq(images.id, id))
    .returning();
}
