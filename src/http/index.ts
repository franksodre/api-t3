import { Elysia } from "elysia";
import { registerUser } from "./routes/register-customer";

import { config } from "dotenv";
import cors from "@elysiajs/cors";
import { SendLink } from "./routes/send-link";
import { invite } from "./routes/invite-manager";
import { registerOwner } from "./routes/register-owner";
import { LoginOwner } from "./routes/auth-owner";
import { registerService } from "./routes/create-service";
import { SignIn } from "./routes/authenticate";
import { HandleInvitation } from "./routes/handle-invitation";

config();

const app = new Elysia()
  .use(cors())
  .use(registerUser)
  .use(SignIn)
  .use(invite)
  .use(HandleInvitation)
  .use(registerService)
  .use(LoginOwner)
  .use(registerOwner)
  .use(SendLink)
  .listen(3000);
