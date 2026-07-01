import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { eventsTable } from "./events";

export const matchesTable = pgTable("matches", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => eventsTable.id, { onDelete: "cascade" }),
  userId1: integer("user_id_1").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  userId2: integer("user_id_2").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.eventId, t.userId1, t.userId2)]);

export type Match = typeof matchesTable.$inferSelect;
