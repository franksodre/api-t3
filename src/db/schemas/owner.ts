import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { RolesEnum } from './users'

export const owner = pgTable('owner', {
  id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  
  roles: RolesEnum('role').default('owner').notNull().unique()
})
