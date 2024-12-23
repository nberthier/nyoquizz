// This is an utils script used for dev purposes.
// Easy way to reset the database by running `bun run populate.ts`

// db.ts
import { drizzle } from '../db';

//populate.ts
async function populate() {
  await drizzle.images.insertImage({
    champion: 'aatrox',
    game: 'lol',
    link: 'https://cdn.discordapp.com/attachments/159394283072258048/1312779785801564211/aatrox_1.png?ex=674dbcf3&is=674c6b73&hm=8fe09c2853939283b7baa0f9fa9b0c3a9c866a5529c7cc7685b05a07f7fe8498&',
    type: 'game',
  });
  await drizzle.images.insertImage({
    champion: 'akali',
    game: 'lol',
    link: 'https://cdn.discordapp.com/attachments/159394283072258048/1312780065175638067/akali_1.png?ex=674dbd35&is=674c6bb5&hm=326e81db9490f4cf92881ced72f199fa93bb17c0de7e00bfa9c16912068322eb&',
    type: 'game',
  });

  console.log('✅ Basic images added');
}

populate().catch((e) => {
  console.error(e);
});
