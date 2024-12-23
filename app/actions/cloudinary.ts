'use server';

import cloudinary from 'cloudinary';

export async function getAllGameImagesSince(game: string, date: string) {
  return await cloudinary.v2.search
    .expression(`folder:game/${game}/* AND created_at>${date}`)
    .with_field('tags')
    .execute();
}
