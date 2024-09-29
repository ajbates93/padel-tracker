export const getAllBookingParticipants = async () => {
  const bookingParticipants = await useDrizzle()
    .select()
    .from(tables.bookingParticipants)
    .all();

  return bookingParticipants;
};

export const createBookingParticipant = async (
  bookingParticipant: BookingParticipantInsert,
) => {
  const newBookingParticipant = await useDrizzle()
    .insert(tables.bookingParticipants)
    .values(bookingParticipant)
    .returning()
    .get();

  return newBookingParticipant;
};
