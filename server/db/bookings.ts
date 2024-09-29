export const getAllBookings = async () => {
  const bookings = await useDrizzle().select().from(tables.bookings).all();

  return bookings;
};

export const getBookingById = async (id: number) => {
  const booking = await useDrizzle()
    .select()
    .from(tables.bookings)
    .where(eq(tables.bookings.id, id));

  return booking;
};
