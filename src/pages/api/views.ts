import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import type { NextApiRequest, NextApiResponse } from 'next';

const vitalsDirectory =
  process.env.NEXT_PUBLIC_VITALS === 'true'
    ? path.resolve('.', process.env.VITALS_PATH).split('/').slice(0, -1).join('/')
    : null;

const VISIT_DELAY = 5000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!vitalsDirectory || !req.body) return res.status(400).end();

  let pathname;
  try {
    ({ pathname } = JSON.parse(req.body));
  } catch (_) {
    return res.status(400).end();
  }
  if (!pathname) return res.status(400).end();

  const visits: Record<string, number[]> = {};
  for (const filename of (await fs.promises.readdir(vitalsDirectory)).sort().reverse()) {
    const content = await fs.promises.readFile(path.join(vitalsDirectory, filename));

    let jsonL = '';
    if (filename.endsWith('.gz')) {
      jsonL = zlib.unzipSync(content).toString();
    } else {
      jsonL = content.toString();
    }

    for (const line of jsonL.split('\n')) {
      if (!line) continue;
      const { vitals, ip } = JSON.parse(line);
      for (const { pathname: vitalPathname, id, ...rest } of vitals) {
        if (vitalPathname !== pathname) continue;

        const epoch = +id.match(/(\d{13})/)[1];
        if (!(ip in visits)) visits[ip] = [0];
        const diff = epoch - visits[ip].at(-1);
        if (diff < VISIT_DELAY) continue;

        visits[ip].push(epoch);
      }
    }
  }

  return res.status(200).send({ views: Object.values(visits).flat().filter(Boolean).length });
}
