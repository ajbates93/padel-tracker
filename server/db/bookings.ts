import type { Booking } from "~/types";

import { getUserById, getAllUsers } from "./users";

const bookings: Booking[] = [
  {
    id: 1,
    bookingUser: getUserById(1)!,
    bookingDate: new Date("2024-09-11"),
    bookingTime: "09:00",
    bookingDuration: 90,
    bookingStatus: "confirmed",
    bookingParticipants: getAllUsers().slice(0, 4),
  },
  {
    id: 2,
    bookingUser: getUserById(2)!,
    bookingDate: new Date("2024-09-08"),
    bookingTime: "17:00",
    bookingDuration: 60,
    bookingStatus: "confirmed",
    bookingParticipants: getAllUsers().slice(0, 4),
  },
  {
    id: 3,
    bookingUser: getUserById(3)!,
    bookingDate: new Date("2024-09-02"),
    bookingTime: "19:00",
    bookingDuration: 60,
    bookingStatus: "confirmed",
    bookingParticipants: getAllUsers().slice(0, 4),
  },
  {
    id: 4,
    bookingUser: getUserById(4)!,
    bookingDate: new Date("2024-08-27"),
    bookingTime: "18:00",
    bookingDuration: 60,
    bookingStatus: "confirmed",
    bookingParticipants: getAllUsers().slice(0, 4),
  },
  {
    id: 5,
    bookingUser: getUserById(1)!,
    bookingDate: new Date("2024-09-27"),
    bookingTime: "18:00",
    bookingDuration: 60,
    bookingStatus: "pending",
    bookingParticipants: getAllUsers().slice(0, 4),
  },
];

export const getAllBookings = () => {
  return bookings;
};

export const getBookingById = (id: number) => {
  return bookings.find((booking) => booking.id === id);
};
