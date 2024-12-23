'use server';

import { drizzle } from '@/db';
import { InsertImage } from '@/db/schema';

export async function addImage(image: InsertImage) {
  return await drizzle.images.insertImage(image);
}

export async function getImagesByGame(game: string) {
  return await drizzle.images.findImagesByGame(game);
}
