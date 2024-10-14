import Elysia, { redirect, t } from "elysia";
import { Qauth } from "./auth-queries";
import { db } from "../../db/connection";
import { users } from "@schemas/users";

import { services } from "@schemas/service";

import { registerUserSchema } from "./auth-queries";
import { z } from "zod";

import { BadRequestError, UnauthorizedError } from "../errors";

/**
 *
 * quando um manager for convidado será redirecionado para o cadastro.
 * onde ele se cadastra como manager.
 * podendo e obrigatoriamente ter 3 opções.bem isso depende muito do que o owner quiser. 
 *
 *  1- gerenciar um projecto já existente.
 *  2- criar um novo projecto.
 *  3- simplesmente entrar e aguardar por instrucoes. ( nothing todo).
 *
 */

// make it simple for now
export const registerServiceSchema = registerUserSchema.extend({
  price: z.number(),
  description: z.string(),
  serviceName: z.string(),
});

export const registerService = new Elysia()
  .use(Qauth)
  // fazer uma schema(do body) propria para esse endpoint
  .post("/create/service", async ({ UserData, cookie: { auth }, set, jwt }) => {
    const currentUser = await jwt.verify(auth.value);

    if (!currentUser) {
      return redirect("/auth/send-link"); // to sign
    }

    const { data } = await UserData();

    const invite = await db.query.invites.findFirst({
      where(fields, { eq }) {
        return eq(fields.recipient, data.email); /* check also the status */
      },
    });

    if (!invite) {
      throw new UnauthorizedError("This page is managers only");
    }

    const [manager] = await db
      .insert(users)
      .values({
        ...data,
        roles: "manager",
      })
      .returning();
    set.status = 201;

    // await db.insert(services).values({
    //   name: 'get tha data from body',
    //   managerId: manager.id,
    //   description: 'get the description from body',
    //   price: 123
    // })
  });
