import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { authLink } from "../../db/schemas/auth-link";
import { UnauthorizedError } from "../errors";
import dayjs from "dayjs";
import { auth } from "../auth.middleware";

export const AuthenticateEmailLink = new Elysia().use(auth).get(
  "/authenticate/email-link",
  async ({ query: { code } }) => {
    const emaiLink = await db.query.authLink.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });






    
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
);


// quando um novo email é criado antes do anterior ser consumido.
// consequentemente não é deletado até ser usado.