import { drizzle } from "drizzle-orm/d1";
export { sql, eq, and, or } from "drizzle-orm";

import * as schema from "../db/schema";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.users.$inferSelect;
export type UserInsert = typeof schema.users.$inferInsert;

export type Booking = typeof schema.bookings.$inferSelect;
export type BookingInsert = typeof schema.bookings.$inferInsert;
