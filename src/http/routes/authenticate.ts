import { Elysia, t } from 'elysia'
import { auth } from '../auth.middleware'
import { db } from '../../db/connection';
import { authLink } from '@schemas/auth-link';
import { eq } from 'drizzle-orm';
import { Qauth } from './auth-queries';
import { UnauthorizedError } from '../errors';

export const SignIn = new Elysia()
.use(auth)
/* use authLinks */
.use(Qauth)
.get(
  '/authenticate/sign-in',
  async ({ SignIn, AuthenticateEmailLink, redirect }) => {
    /* dont't forget to check the role of the user */
    const { data, errors } = await AuthenticateEmailLink();

    if(data) {
      const { code, emaiLink, redirectLink  } = data;

      // i don't know why the error without probably because userId can be null "as string"
      SignIn('customer', {
        userID: emaiLink.userId as string, 
      });
  
      await db.delete(authLink).where(eq(authLink.code, code));
  
      return redirect(redirectLink);
  
    }

    return errors?.error
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)

