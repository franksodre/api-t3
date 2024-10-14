import Elysia, { redirect, t } from "elysia";
import { auth } from "../auth.middleware";
import { Qauth } from "./auth-queries";
import { db } from "../../db/connection";
import { invites } from "@schemas/invite";
import { eq, or } from "drizzle-orm";


export const HandleInvitation = new Elysia()
  .use(auth)
  .use(Qauth)
  .patch(
    '/invitation',
    async ({ AuthenticateEmailLink, set }) => {
      const { data, errors } = await AuthenticateEmailLink();

      if(errors) {
        throw new Error(errors?.error.toString())
      }

      if(data && data.id) {        
        console.log(data)
        
        await db.update(invites).set({ status: 'accepted' /* should i handle with the 'refused' status */ })
        .where(
          or(
            eq(invites.id, data?.id), 
            eq(invites.recipient, data?.id)
          )
        );
  
        redirect(data.redirectLink);
        console.log(1)
        return;
        
      }

      set.status = 401;
    },
    {
      query: t.Object({
        code: t.String(),
        redirect: t.String(),
        id: t.String(),
      })
    }
  )

  /* 
  "accepted"

    {
      await db.insert(invites).values({
        recipient: email,
        message,
        by: owner.data.id,
        status: 'accepted'
      });
    }
    
  */