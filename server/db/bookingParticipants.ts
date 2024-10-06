import { bookingParticipants } from "./schema";

const db = useDrizzle();

export const createBookingParticipant = async (bookingParticipantInput: {
  user_id: string;
  booking_id: number;
  paid: boolean;
}) => {
  const newBookingParticipant = await db
    .insert(tables.bookingParticipants)
    .values(bookingParticipantInput)
    .returning();

  return newBookingParticipant;
};

export const updateBookingParticipant = async (
  id: number,
  updateData: Partial<typeof bookingParticipants.$inferInsert>,
) => {
  const result = await db
    .update(bookingParticipants)
    .set(updateData)
    .where(eq(bookingParticipants.id, id))
    .returning();

  return result[0] || null;
};
