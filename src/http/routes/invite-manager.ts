import Elysia, {t} from 'elysia'

import { auth } from '../auth.middleware'
import { BadRequestError } from '../errors';
import { db } from '../../db/connection';
import { invites } from '@schemas/invite';
import { env } from '@env';
import { Qauth } from './auth-queries';
import { GenerateLinks } from '../../utils/generate-link';
import { authLink } from '@schemas/auth-link';
import { inviteLink } from '@schemas/invite-link';

export const invite = new Elysia()
.use(auth)
.use(Qauth)
  .post(
    '/invite',
    async ({ body: { email, message }, getOwner }) => {
      const owner = await getOwner();
      
      
      const user = await db.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, email);
        }
      })

      if(user) {
        throw new BadRequestError('there may already be a user with this email');
      }

      const invite = await db.query.invites.findFirst({
        where(fields, { eq }) {
          return eq(fields.recipient, email)
        },
      })

      if(invite) {
        // make the invite via email again;

        const { Link, code } = GenerateLinks('/invitation', env.REDIRECT_URL, invite.id);
        
        await db.insert(inviteLink).values({
          code
        })
        
        return Link;
      }
      
      await db.insert(invites).values({
        recipient: email,
        message,
        by: owner.data.id
      });
      

      const { Link, code } = GenerateLinks('/invitation', env.REDIRECT_URL, email);
        
      await db.insert(inviteLink).values({
        code
      })
      
      return Link;

    
    /* use resend to send the link */

  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      message: t.String({ maxLength: 1000 })
    })
  })

 
    

//   const user = await db.query.users.findFirst({
//     where(fields, { eq }) {
//       return eq(fields.email, email)
//     }
//   })

//   const invite = await db.query.invites.findMany({
//     where(fields, { ne, eq }) {
//       return eq(fields.recipient, email)
//     },
//   })
  
//   console.log(invite == '[]');

//  if(invite) {
//     invite.filter(col => {
//       if(col.status == 'accepted' || 'received' || 'refused') {
//         // throw new BadRequestError('this candidate already been requested');
//         throw new BadRequestError('seems this candidate already answer this request');
//       }

//     })
    
//   }

  /* this is crap, should be on the email template, why i have a table invites? */
  // await db.insert(invites).values({
  //   recipient: email,
  //   message,
  //   by: owner.data.id
  // });


  // if(user) {
  //   throw new BadRequestError('there may already be a user with this email');
  // }


  // const { Link: { href }, code } = GenerateLinks('/invitation', env.REDIRECT_URL, id[0].id); 

  // // use invite link instead
  // await db.insert(authLink).values({
  //   code: code,
  //   userId: 'wizt344uymaoklweqlrvwc2s'
  // })

  // console.log({ link: href });
