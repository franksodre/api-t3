import Elysia, { t } from "elysia";

import { env } from "@env";
import { db } from "../../db/connection";
import { authLink } from "@schemas/auth-link";

import { auth } from "../auth.middleware";
import { resend } from "../../mail/resend";
import { BadRequestError } from "../errors";
import { GenerateLinks } from "../../utils/generate-link";

/* colocar um timer para o intervalo de links ao enviar */

export const SendLink = new Elysia().use(auth)
  .post(
    '/auth/send-link',
    async ({ body: { email } }) => {
      const user = await db.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, email);
        },
      });

      if (!user) {
        throw new BadRequestError("invalid email!");
      }

      const { code, Link: { href } } = GenerateLinks('/authenticate/sign-in', env.REDIRECT_URL);

      await db.insert(authLink).values({
        userId: user.id,
        code: code,
      });
      console.log({ link: href });
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )

        // const { data, error } = await resend.emails.send({
      //   from: "HSF <onboarding@resend.dev>",
      //   to: email,
      //   subject: "Sign in HSF",
      //   html: `${Link}`,
      // });

      // if (error) {
      //   return console.error({ error });
      // }