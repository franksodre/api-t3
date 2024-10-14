import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { services } from './service'
import { varchar } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const PricingPlansEnum = pgEnum('PricingPlans_enum', ['basic', 'standard', 'premium', 'custom']);

export const pricingPlans = pgTable('pricing_plans', {
  id: text('id').$defaultFn(() => createId())
      .primaryKey(),

  name: PricingPlansEnum('name').default('basic').notNull(),
  details: varchar('details', { length: 100 }).notNull(),
  package: varchar('package', { length: 100 })
      .array()
      .notNull()
      .default(sql`ARRAY[]::varchar[]`),

  promises: text('promises')
    .array(4)
    .default(sql`'{}'::text[]`),
  serviceId: text('service_id').references(() => services.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),

})


export const pricingPlansRelations = relations(pricingPlans, ({ one }) => ({
  service: one(services, {
    fields: [pricingPlans.id],
    references: [services.id],
    relationName: 'pricingPlans_Services'
  })
})) 

