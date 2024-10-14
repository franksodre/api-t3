import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { orders } from './order'
import { category } from './category'

export const services = pgTable('services', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  managerId: text('manager_id').references(() => users.id),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  // images 

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const serviceRelations = relations(services, ({ one, many }) => ({
  manager: one(users, {
    fields: [services.managerId],
    references: [users.id],
    relationName: 'serviceManager'
  }),

  orders: many(orders)
}))