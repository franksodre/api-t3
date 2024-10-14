import Elysia from "elysia";
import { Qauth } from "./auth-queries";


const registerManager = new Elysia()
  .use(Qauth)
  // TODO: a middleware to redirect signed users;
  .post('/sign-up/register', ({ UserData }) => {

  })
