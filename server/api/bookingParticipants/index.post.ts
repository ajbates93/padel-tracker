import { createBookingParticipant } from "../../db/bookingParticipants";

export default defineEventHandler(async (event) => {
  const { user_id, booking_id, paid } = await readBody(event);

  const newBookingParticipant = {
    user_id,
    booking_id,
    paid,
  };

  const response = createBookingParticipant(newBookingParticipant);

  if (response) {
    return {
      success: true,
      data: response,
    };
  } else {
    return {
      success: false,
      error: "Could not create new booking participant.",
    };
  }
});
