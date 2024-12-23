import type { NextApiRequest, NextApiResponse } from 'next';

import cloudinary from 'cloudinary';

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (
    cloudinary.v2.utils.verifyNotificationSignature(
      req.body,
      parseInt(req.headers['X-Cld-Timestamp'] as string),
      req.headers['X-Cld-Signature'] as string
    )
  ) {
    return res.status(200).json({ message: 'Notification received' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
}
