const db = useDrizzle()

export const getAllBookings = async () => {
  const bookings = await db.select().from(tables.bookings);

  return bookings;
};

export const getBookingById = async (id: number) => {
  const booking = await db 
    .select()
    .from(tables.bookings)
    .where(eq(tables.bookings.id, id));

  return booking;
};
