import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique(),
  avatar: text("avatar"),
  status: text("status").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deleted_at: integer("deleted_at", { mode: "timestamp" }),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  created_id: integer("creator_id")
    .notNull()
    .references(() => users.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const bookingParticipants = sqliteTable("booking_participants", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  booking_id: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(), // e.g., 'creator', 'participant'
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
