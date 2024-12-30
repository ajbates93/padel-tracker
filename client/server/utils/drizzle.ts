import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
export { sql, eq, and, or } from "drizzle-orm";

import * as schema from "../db/schema";

export const tables = schema;

let db: ReturnType<typeof drizzle> | null = null;

export function useDrizzle() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined");
    }

    const client = postgres(connectionString);
    db = drizzle(client, { schema });
  }

  return db;
}

export type User = typeof schema.users.$inferSelect;
export type UserInsert = typeof schema.users.$inferInsert;

export type Booking = typeof schema.bookings.$inferSelect;
export type BookingInsert = typeof schema.bookings.$inferInsert;

export type BookingParticipant = typeof schema.bookingParticipants.$inferSelect;
export type BookingParticipantInsert =
  typeof schema.bookingParticipants.$inferInsert;
