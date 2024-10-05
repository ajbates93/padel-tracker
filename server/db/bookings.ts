import type { BookingStatus } from "~/types";
import type { PgSelect } from "drizzle-orm/pg-core";
import { bookings, users } from "./schema";
import { and, eq, desc, asc, ilike } from "drizzle-orm";

const db = useDrizzle();

export const getAllBookings = async (params: {
  q?: string;
  statuses?: BookingStatus[];
  sort?: "date" | "user_id";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) => {
  const { q, statuses, sort, order, page, pageSize } = params;

  let query = db
    .select({
      booking: bookings,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.user_id, users.id))
    .$dynamic();

  // Apply search filter
  if (q) {
    query = query.where(ilike(users.name, `%${q}%`));
  }

  // Apply status filter
  if (statuses && statuses.length > 0) {
    query = query.where(
      and(...statuses.map((status) => eq(bookings.status, status))),
    );
  }

  // Apply sorting
  if (sort) {
    const orderFunc = order === "desc" ? desc : asc;
    if (sort === "date") {
      query = query.orderBy(orderFunc(bookings.date));
    } else if (sort === "user_id") {
      query = query.orderBy(orderFunc(users.name));
    }
  }

  // Apply pagination
  if (page !== undefined && pageSize !== undefined) {
    query = withPagination(query, page, pageSize);
  }

  const results = await query;

  const response = results.map(({ booking, user }) => ({
    ...booking,
    user,
  }));

  return response;
};

export const createBooking = async (booking: {
  date: Date;
  time: string;
  duration: number;
  status: string;
  user_id: string;
}) => {
  console.log(booking);
  const newBooking = await db
    .insert(tables.bookings)
    .values(booking)
    .returning();

  return newBooking;
};

// Helper function for pagination
function withPagination<T extends PgSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}
