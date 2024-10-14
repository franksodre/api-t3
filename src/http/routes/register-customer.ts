import Elysia, { t } from "elysia";
import { db } from "../../db/connection";

import { users } from "@schemas/users";
import { auth } from "../auth.middleware";
import { Qauth } from "./auth-queries";

export const registerUser = new Elysia()
  .use(auth)
  .use(Qauth)
  .post("/sign-up", async ({ UserData, set }) => {
    const { data } = await UserData();
    await db.insert(users).values(data);
    
    set.status = 201;
  });
