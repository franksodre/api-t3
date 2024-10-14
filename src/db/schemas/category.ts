import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { services } from "./service";
import { relations } from "drizzle-orm";

export const category = pgTable('category', {
  id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
  name: varchar('name', { length: 28 })
    .notNull()
    .unique(),
  serviceId: text('service_id').references(() => services.id, {
    onDelete: 'cascade'
  }),
})

export const categoryRelations = relations(category, ({ one }) => ({
  service: one(services, {
    fields: [category.serviceId],
    references: [services.id]
  })
}))
