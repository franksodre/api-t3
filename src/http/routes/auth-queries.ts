// the idea here is to be a elysia plugin to make queries related to authentication

import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { z } from "zod";
import { BadRequestError, UnauthorizedError } from "../errors";
import { auth } from "../auth.middleware";
import { authLink } from "@schemas/auth-link";

import dayjs from "dayjs";

export const registerUserSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email({ message: "invalid email format" }).min(13).max(28),
  phone: z
    .string()
    .regex(/^9\d{8}$/, { message: "invalid phone number. phone field must start with a 9 digit "})
    .length(9, { message: "phone number field should have a 9 length " })
})


export const QuerySchema = z.object({
  id: z.string().optional(),
  code: z.string(),
  redirect: z.string(),
})


export const Qauth = new Elysia()
  .derive({ as: "global" }, async ({ body }) => {
    return {
      UserData: async () => {
        const { ...data } = registerUserSchema.parse(body);
 
       const userAlreadyExists = await db.query.users.findFirst({
         where(fields, { eq, or }) {
           return or(
             eq(fields.email, data.email),
             eq(fields.phone, data.phone)
           )
         },
       })
   
       if (userAlreadyExists) {
         throw new BadRequestError("email or phone already in use");
       }

       return {
        data
       }
      }
     }
    })
  .use(auth)
  .derive({ as: 'global' }, ({ getCurrentUser }) => {
    return {
      getOwner: async () => {
        const { OwnerID } = await getCurrentUser<'owner'>();

        const owner = await db.query.owner.findFirst({
          where(fields, { eq }) {
            return eq(fields.id, OwnerID)
          }
        })

        if(!owner) {
          throw new UnauthorizedError(`only owners can invite`)/* reformular a mensagem para algo mais discreto 12/22/24 */
        }

        return {
          data: owner
        } as const

      }
    }
  })
  .derive({ as: 'global' }, ({ query }) => {
    const { data, success, error } = QuerySchema.safeParse(query);

    return {
      AuthenticateEmailLink: async () => {
        if(!success) {
          return {
            errors: {
              error: error.flatten()
            }
          }
        }

        const { code, redirect, id } = data;

        const emaiLink = await db.query.authLink.findFirst({
          where(fields, { eq }) {
            return eq(fields.code, code)
          },
        })

        if(!emaiLink) {
          throw new UnauthorizedError('this link might be expired! or even wrong.');
        }

        console.log({
          true: authLink.code,
          sended: code
        })
    
        return {
          data: {
            id,
            code,
            emaiLink,
            redirectLink: redirect,
          }
        }

      }
    }
  })
  .derive({ as: "global" }, ({ query }) => {
    const { data, success, error } = QuerySchema.safeParse(query);

      return {
        AuthenticateInvitationLink: async () => {
          
          if(!success) {
            return {
              errors: {
                error: error.flatten()
              }
            }
          }


          const { code, redirect, id } = data;
          
          const inviteLink = await db.query.inviteLink.findFirst({
            where(fields, { eq }) {
              return eq(fields.code, code)
            },
          })
          
          if (!inviteLink) {
            throw new UnauthorizedError();
          }

          if (dayjs().diff(inviteLink.created_at, "minutes") > 3) {
            throw new UnauthorizedError("este email esta expirado");
          }
          
          return {
            data: {
              id,
              code,
              redirectLink: redirect,
            }
          }

        }
      }
    })
  /* 

  const eq = fun('role', {
    ...intellisense
  })

  ===

  const { ...intellisense } = fun<'role'>()

*/
