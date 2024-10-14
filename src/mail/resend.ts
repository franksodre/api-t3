import { env } from '../../env'

import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);

// async function () {
//   const { data, error } = await resend.emails.send({
//     from: 'Acme <onboarding@resend.dev>',
//     to: ['delivered@resend.dev'],
//     subject: 'Hello World',
//     html: '<strong>It works!</strong>',
//   });

//   if (error) {
//     return console.error({ error });
//   }

//   console.log({ data });
// };
