import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const RolesEnum = pgEnum('roles_enum', ['customer', 'manager', 'owner'])

export const users = pgTable('users', {
  id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  
  roles: RolesEnum('role').default('customer').notNull()
})

// notes: create the service table relationship. where one user can request many services