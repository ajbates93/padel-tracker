import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  varchar,
  timestamp,
  uuid,
  serial,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").unique(),
  avatar: text("avatar"),
  status: varchar("status").notNull().default("inactive"),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deleted_at: timestamp("deleted_at"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id")
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
  deleted_at: timestamp("deleted_at"),
});

export const bookingParticipants = pgTable("booking_participants", {
  id: serial("id").primaryKey(),
  booking_id: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  paid: boolean("paid").default(false),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deleted_at: timestamp("deleted_at"),
});
