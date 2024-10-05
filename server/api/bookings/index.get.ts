import type { BookingStatus } from "~/types";
import { getAllBookings } from "../../db/bookings";

export default defineEventHandler(async (event) => {
  const { q, statuses, sort, order } = getQuery(event) as {
    q?: string;
    statuses?: BookingStatus[];
    sort?: "date" | "user_id";
    order?: "asc" | "desc";
  };

  const bookings = await getAllBookings({ q, statuses, sort, order });

  const response = {
    success: true,
    data: bookings,
  };

  return response;
});
