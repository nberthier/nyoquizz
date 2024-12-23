// This is an utils script used for dev purposes.
// Easy way to reset the database by running `bun run scripts/create-set.ts`

// db.ts
import { drizzle } from '../db';

//create-set.ts
async function createSet() {
  const newImagesSet = await drizzle.imagesSets.insertImagesSet({
    game: 'lol',
  });
  const randomImages = await drizzle.images.getTenRandomImages('lol');
  randomImages.forEach(async (image, index) => {
    await drizzle.images.linkToImagesSet(image.id, newImagesSet[0].id, index);
  });

  console.log('✅ New set of images created');
}

createSet().catch((e) => {
  console.error(e);
});
