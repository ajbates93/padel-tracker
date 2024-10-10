import {
  getBookingParticipantById,
  updateBookingParticipant,
} from "~~/server/db/bookingParticipants";

export default defineEventHandler(async (event) => {
  // Get the booking participant ID from the query params
  const bookingParticipantId = event.context.params?.id as string;
  const id = parseInt(bookingParticipantId);

  if (!bookingParticipantId) {
    return {
      success: false,
      error: "Booking Participant ID is required",
    };
  }

  if (isNaN(id)) {
    return {
      success: false,
      error: "Booking Participant ID must be a number",
    };
  }

  // Get the updated booking participant data from the request body
  const { user_id, paid } = await readBody(event);

  // Check if the booking participant exists
  const existingBookingParticipant = await getBookingParticipantById(id);
  if (!existingBookingParticipant) {
    return {
      success: false,
      error: "Booking Participant not found.",
    };
  }

  // Prepare the update object
  const updateData = {
    ...(user_id !== undefined && { user_id }),
    ...(paid !== undefined && { paid }),
    updated_at: new Date(),
  };

  // Only update if there are changes
  if (Object.keys(updateData).length === 0) {
    return {
      success: false,
      error: "No updates provided.",
    };
  }

  // Update the bookingParticipant
  const updatedBookingParticipant = await updateBookingParticipant(
    id,
    updateData,
  );

  if (updatedBookingParticipant) {
    return {
      success: true,
      data: updatedBookingParticipant,
    };
  } else {
    return {
      success: false,
      error: "Could not update booking participant.",
    };
  }
});
