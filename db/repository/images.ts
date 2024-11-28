import { db } from '@/db';
import { InsertImage } from '@/db/schema';
import { images } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

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

export async function insertImage(image: InsertImage) {
  return await db.insert(images).values(image);
}

export async function updateImageDifficulty(id: string, difficulty: string) {
  return await db
    .update(images)
    .set({ difficulty, updatedAt: sql`NOW()` })
    .where(eq(images.id, id))
    .returning({ updatedAge: images.difficulty });
}
