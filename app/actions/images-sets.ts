'use server';

import { drizzle } from '@/db';
import { InsertImagesSet } from '@/db/schema';

export async function createOne(imagesSet: InsertImagesSet) {
  return await drizzle.imagesSets.insertImagesSet(imagesSet);
}

export async function getAllByGame(game: string, page: number = 1) {
  return await drizzle.imagesSets.findAllImagesSetsByGameWithPagination(
    game,
    page
  );
}

export async function getByDate(game: string, date: number) {
  return await drizzle.imagesSets.findImagesSetByGameAndDate(game, date);
}
