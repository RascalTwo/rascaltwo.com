import type { NextApiRequest, NextApiResponse } from 'next';

// Reports which commit this running server was built from. The deploy job on the NAS
// only counts a deploy as successful once this answers with the commit GitHub built.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ sha: process.env.GIT_SHA || null });
}
