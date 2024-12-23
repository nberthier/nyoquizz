import type { NextApiRequest, NextApiResponse } from 'next';

import { drizzle } from '@/db';
import _ from 'lodash';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const newImagesSet = await drizzle.imagesSets.insertImagesSet({
    game: 'lol',
  });
  const randomImages = await drizzle.images.getTenRandomImages('lol');
  _.forEach(randomImages, async (image, index) => {
    await drizzle.images.linkToImagesSet(image.id, newImagesSet[0].id, index);
  });
  res.status(200).json({ message: 'Hello from Next.js!' });
}
