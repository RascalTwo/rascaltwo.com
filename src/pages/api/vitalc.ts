import type { NextApiRequest, NextApiResponse } from 'next';

const checking = process.env.NEXT_PUBLIC_VITALS === 'true' ? new Set<string>() : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checking) return res.status(403).end();

  const ID = req.body;
  if (!ID) return res.status(400).end();

  if (checking.has(ID)) return res.status(200).send(1);

  checking.add(ID);
  setTimeout(() => checking.delete(ID), 10000);
  return res.status(200).send(0);
}
