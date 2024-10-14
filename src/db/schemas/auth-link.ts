
import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const authLink = pgTable("auth_link", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: 'cascade'
    }),
  code: text("code").unique().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
