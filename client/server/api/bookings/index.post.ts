import { createBooking } from "../../db/bookings";

export default defineEventHandler(async (event) => {
  const { date, time, duration, status } = await readBody(event);

  const newBooking = {
    date,
    time,
    duration,
    status: status || "pending",
    user_id: "b28ea0f9-10de-4a97-8642-667b8c68cb65", // TODO: remove at some point
  };

  const response = createBooking(newBooking);

  if (response) {
    return {
      success: true,
      data: response,
    };
  } else {
    return {
      success: false,
      error: "Could not create new booking.",
    };
  }
});
