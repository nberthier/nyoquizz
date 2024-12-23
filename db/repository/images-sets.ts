import { db } from '@/db';
import { imagesSets, InsertImagesSet } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteImagesSet(id: string) {
  return await db.delete(imagesSets).where(eq(imagesSets.id, id));
}

export async function findAllImagesSetsByGame(game: string) {
  return await db.query.imagesSets.findMany({
    orderBy: (imagesSet, { desc }) => [desc(imagesSet.createdAt)],
    where: (imagesSet) => eq(imagesSet.game, game),
  });
}

export async function findAllImagesSetsByGameWithPagination(
  game: string,
  page: number = 1,
  pageSize: number = 16
) {
  return await db.query.imagesSets.findMany({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: (imagesSet, { desc }) => [desc(imagesSet.createdAt)],
    where: (imagesSet) => eq(imagesSet.game, game),
  });
}

export async function findImagesSetByGameAndDate(game: string, date: number) {
  return await db.query.imagesSets.findFirst({
    where: (imagesSet) =>
      eq(imagesSet.createdAt, date) && eq(imagesSet.game, game),
    with: {
      images: {
        orderBy: (image, { asc }) => [asc(image.indexInSet)],
      },
    },
  });
}

export async function findImagesSetById(id: string) {
  return await db.query.imagesSets.findFirst({
    where: (imagesSet) => eq(imagesSet.id, id),
  });
}

export async function insertImagesSet(imagesSet: InsertImagesSet) {
  return await db
    .insert(imagesSets)
    .values({ ...imagesSet, createdAt: Date.now() })
    .returning();
}
