import { sql } from "drizzle-orm";
import { pgTable, text, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique(),
  avatar: text("avatar"),
  status: varchar("status").notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deleted_at: timestamp("deleted_at"),
});

export const bookings = pgTable("bookings", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  created_id: integer("creator_id")
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull(),
  status: varchar("status").notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const bookingParticipants = pgTable("booking_participants", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  booking_id: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  role: varchar("role").notNull(), // e.g., 'creator', 'participant'
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
