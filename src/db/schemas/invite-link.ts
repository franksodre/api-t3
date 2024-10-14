import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const inviteLink = pgTable("invite_link", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  code: text("code").unique().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
