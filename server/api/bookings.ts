import type { BookingStatus } from "~/types";
import { getAllBookings } from "../db/bookings";

const bookings = getAllBookings();

export default defineEventHandler(async (event) => {
  const { q, statuses, sort, order } = getQuery(event) as {
    q?: string;
    statuses?: BookingStatus[];
    sort?: "bookingDate";
    order?: "asc" | "desc";
  };

  await new Promise(function (resolve) {
    setTimeout(resolve, 500);
  });

  return bookings
    .filter((booking) => {
      if (!q) return true;

      return booking.bookingUser.name.search(new RegExp(q, "i")) !== -1;
    })
    .filter((booking) => {
      if (!statuses) return true;
      return statuses.includes(booking.bookingStatus);
    })
    .sort((a, b) => {
      if (!sort) return 0;

      const aValue = a[sort];
      const bValue = b[sort];

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
});
