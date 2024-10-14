import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { services } from "./service";
import { relations } from "drizzle-orm";


export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'ACCEPTED',
  'IN_PROGRESS',
  // 'UNDER_REVISION',
  'REVIEWING',
  'COMPLETED',
  'CANCELLED'
])


export const orders = pgTable('orders', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text('customer_id')
    .references(() => users.id, {
      onDelete: 'restrict',
    })
    .notNull(),
  serviceId: text('service_id')
    .references(() => services.id, {
      onDelete: 'restrict',
    }).notNull(),

  status: orderStatusEnum('status').default('PENDING'),

  finishedAt: timestamp('finished_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const orderRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  // customer: one(users),
  // service: one(services),
}));
