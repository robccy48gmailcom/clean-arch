import FormData from 'form-data'; // form-data v4.0.1
import Mailgun from 'mailgun.js'; // mailgun.js v11.1.0
import { app } from '../../../config';

export type resetPasswordEmailArgs = {
  email: string;
  verifyToken: string;
};

export default async function resetPasswordEmail({
  email,
  verifyToken,
}: resetPasswordEmailArgs) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.API_KEY || 'API_KEY',
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  const link = `${app.frontendUrl}/resetpassword?token=${encodeURIComponent(verifyToken)}`;
  // try {
  const data = await mg.messages.create(
    'sandboxfbdcec0943d0473f8a66fee17e85f5e8.mailgun.org',
    {
      from: 'Mailgun Sandbox <postmaster@sandboxfbdcec0943d0473f8a66fee17e85f5e8.mailgun.org>',
      to: [`Robert Chan <${email}>`],
      subject: 'Hello Robert Chan',
      text: `Click on this link to reset password.\n ${link}`,
    },
  );

  console.log('data', data); // logs response data
  //} catch (error) {
  //console.log('error: ', error); //logs any error
  //throw error;
  //}
}
