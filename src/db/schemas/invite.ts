import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { owner } from './owner'

export const StateInvitation = pgEnum('StateInvitation_enum', ['accepted', 'refused', 'received', 'no actions']);

export const invites = pgTable('invites', {
  id: text('id')
    .$defaultFn(() => createId())
      .primaryKey(),
  recipient: text('recipient').notNull().unique(),
  by: text('by').references(() =>  owner.id, {
    onDelete: 'cascade'
  }),
  message: varchar('message', { length: 300 }).notNull(),
  status: StateInvitation('status').default('no actions').notNull(),
  created_at: timestamp('created_at').defaultNow(),  
})
