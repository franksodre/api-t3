import { Elysia, Static, t } from 'elysia'

import jwt from '@elysiajs/jwt'
import cookie from '@elysiajs/cookie'
import { UnauthorizedError, BadRequestError } from './errors'

import { RoleSchemas as payloadSchema, Roles, RoleProps } from '../Types/roles'

const fiveDaysInMiliseconds = 60 * 60 * 24 * 1000 * 5;

export const auth = new Elysia() 
  .error(({
    ['UNAUTHORIZED']: UnauthorizedError,
    ['BAD_REQUEST']: BadRequestError
  }))
  .onError({ as: 'global' }, ({ code, error, set }) => {
    switch(code) {
      case 'UNAUTHORIZED': 
        set.status = 401;
        return { code, message: error.message }
      case 'INTERNAL_SERVER_ERROR': 
        set.status = 500;
        return { code, message: error.message }
      case 'BAD_REQUEST':
        set.status = 400;
        return { code, message: error.message }
        // error.validator.Errors(error.value).First().message
    }
  })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
      exp: '5d',
      schema: payloadSchema
    })
  )
  .use(cookie())
  .derive({ as: 'global' }, ({ cookie: { auth }, jwt }) => {
    return {
      getCurrentUser: async <T extends Roles>(): Promise<RoleProps<T>> => {
        const payload = await jwt.verify(auth.value)

        if (!payload) {
          throw new BadRequestError();
        }

        return payload as RoleProps<T>
      },
      SignIn: async <T extends Roles>(_role: T, payload: RoleProps<T>) => {
        auth.set({
          value: await jwt.sign(payload),
          httpOnly: true,
          expires: new Date(Date.now() + fiveDaysInMiliseconds)
        })
        
        return payload
      },
    }
  })
  // a function that says the role of some entity(users) taken
