import path from 'path';
import { createStream } from 'rotating-file-stream';
import requestIp from 'request-ip';
import type { NextApiRequest, NextApiResponse } from 'next';

let RFS;
if (process.env.NEXT_PUBLIC_VITALS === 'true') {
  const filepath = path.resolve('.', process.env.VITALS_PATH);
  console.log('Vitals Filepath:', filepath);
  RFS = createStream(filepath, {
    size: '10M',
    interval: '1d',
    compress: 'gzip',
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!RFS) return res.status(403).end();

  try {
    const data = JSON.parse(req.body);
    RFS.write(
      '\n' +
        JSON.stringify({
          vitals: Array.isArray(data) ? data : [data],
          ip: requestIp.getClientIp(req),
        }),
    );
    return res.status(200).end();
  } catch (e) {
    return res.status(400).end();
  }
}
