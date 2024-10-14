import Elysia, {t} from "elysia";
import { db } from "../../db/connection";
import { BadRequestError, UnauthorizedError } from "../errors";
import { auth } from "../auth.middleware";
import { z } from "zod";


// maybe i can extend from a base schema
const LoginOwnerSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'email must be ' }),
  password: z.string().min(8, { message: 'password must be at least 8 characters length' }).max(28, {
    message: 'password cannot be greater than 28'
  })
})

export const LoginOwner = new Elysia()
  .use(auth)
  // checking the cookie to refuse a user already signed
  .post('/auth/level-up', async ({ body, SignIn, redirect, query: { redirect: linkredirect } }) => {
    const { ...data } = LoginOwnerSchema.parse(body);
    // maybe i can make different!
    const owner = await db.query.owner.findFirst({
      where(fields, {eq}){
        return eq(fields.email, data.email)
      }
    })

    if(!owner) {
      throw new BadRequestError('this user does not exists!') // dangerous message!
    }

    const checkPass = await Bun.password.verify(data.password, owner.password, 'bcrypt');

    if(!checkPass) {
      throw new BadRequestError('The fields seem incorrect, please check your email or password')
    }

    await SignIn('owner', {
      OwnerID: owner.id
    })

    redirect(linkredirect ?? '/');

  }, {
    query: t.Object({
      redirect: t.Optional(t.String())
    })
  })
