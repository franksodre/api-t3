import Elysia, {t as Type} from "elysia";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors";
import { owner as LevelUp } from "@schemas/owner";


export const registerOwner = new Elysia()
  .post(
    '/sign-up/level-up',
    async ({ body: { name, email, password }, set}) => {
      const owner = await db.query.owner.findFirst({
        where(fields, {eq}){
          return eq(fields.email, email)
        }
      })

      if(owner) {
        throw new UnauthorizedError('email already in use')
      }
      
      const hashPass = await Bun.password.hash(password, 'bcrypt');
        
      await db.insert(LevelUp).values({
        name,
        email,
        password: hashPass,
      })

      set.status = 201;
      
    }, {
      body: Type.Object({
        name: Type.String({ maxLength: 30 }),
        email: Type.String({ format: 'email' }),
        password: Type.String({ maxLength: 28  })
      })
    })
