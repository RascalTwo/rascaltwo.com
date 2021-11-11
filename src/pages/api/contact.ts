import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';

const TRANSPORT = JSON.parse(process.env.NODEMAILER_TRANSPORT);
const SENDMAIL = JSON.parse(process.env.NODEMAILER_SENDMAIL);

const transporter = nodemailer.createTransport(TRANSPORT);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name='', email='', phone='', website='', message='' } = req.body ?? {};
  if (!name || !message) return res.status(400).end();
  await transporter.sendMail({
    ...SENDMAIL,
    text: `Contact Message received at ${Date.now()}: ${JSON.stringify({ name, email, phone, website, message}, null, '  ')}`
  })
  return res.status(200).end();
}
