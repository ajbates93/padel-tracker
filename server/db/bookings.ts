import type { BookingStatus } from "~/types";
import type { PgSelect } from "drizzle-orm/pg-core";
import { bookingParticipants, bookings, users } from "./schema";
import { and, eq, desc, asc, ilike, aliasedTable, lte, gt } from "drizzle-orm";

const db = useDrizzle();

// Alias for the users table
const participantUsers = aliasedTable(users, "participant_users");

export const getAllBookings = async (params: {
  q?: string;
  where: "future" | "all";
  statuses?: BookingStatus[];
  sort?: "date" | "user_id";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) => {
  const { q, where, statuses, sort, order, page, pageSize } = params;

  let query = db
    .select({
      booking: {
        id: bookings.id,
        date: bookings.date,
        time: bookings.time,
        duration: bookings.duration,
        status: bookings.status,
      },
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        status: users.status,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
      },
      participant: {
        id: bookingParticipants.id,
        paid: bookingParticipants.paid,
      },
      participantUser: {
        id: participantUsers.id,
        name: participantUsers.name,
        avatar: participantUsers.avatar,
        email: participantUsers.email,
        status: participantUsers.status,
        created_at: participantUsers.created_at,
        updated_at: participantUsers.updated_at,
        deleted_at: participantUsers.deleted_at,
      },
    })
    .from(bookings)
    .where(gt(bookings.date, new Date()).if(where === "future"))
    .leftJoin(users, eq(bookings.user_id, users.id))
    .leftJoin(
      bookingParticipants,
      eq(bookings.id, bookingParticipants.booking_id),
    )
    .leftJoin(
      participantUsers,
      eq(bookingParticipants.user_id, participantUsers.id),
    )
    .$dynamic();

  //if (where === "future") {
  //  query = query.where(gt(bookings.date, new Date()));
  //}

  // Apply search filter
  if (q) {
    query = query.where(ilike(users.name, `%${q}%`));
  }

  console.log(statuses);

  if (statuses) {
    // Apply status filter
    const statusArray = Array.isArray(statuses) ? statuses : [statuses];
    if (statusArray.length > 0) {
      query = query.where(
        and(...statusArray.map((status) => eq(bookings.status, status!))),
      );
    }
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

  const response = mapQueryResultToResponse(results);

  return response;
};

type QueryResult = {
  booking: {
    id: number;
    date: Date;
    time: string;
    duration: number;
    status: string;
  };
  owner: User | null;
  participant: {
    id: number;
    paid: boolean | null;
  } | null;
  participantUser: User | null;
};

function mapQueryResultToResponse(results: QueryResult[]) {
  const bookingsMap = new Map();

  results.forEach((row) => {
    if (!bookingsMap.has(row.booking.id)) {
      bookingsMap.set(row.booking.id, {
        ...row.booking,
        owner: row.owner || null,
        participants: [],
      });
    }

    if (row.participant && row.participantUser) {
      bookingsMap.get(row.booking.id).participants.push({
        id: row.participant.id,
        paid: row.participant.paid,
        user: row.participantUser,
      });
    }
  });

  return Array.from(bookingsMap.values());
}

export const createBooking = async (bookingInput: {
  date: Date | string;
  time: string;
  duration: number;
  status: string;
  user_id: string;
}) => {
  // Parse the data if it's a string
  const parsedDate =
    bookingInput.date instanceof Date
      ? bookingInput.date
      : new Date(bookingInput.date);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  const bookingData = {
    ...bookingInput,
    date: parsedDate,
  };

  const newBooking = await db
    .insert(tables.bookings)
    .values(bookingData)
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
