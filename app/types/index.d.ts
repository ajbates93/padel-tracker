import type { Avatar } from "#ui/types";

export type UserStatus = "active" | "inactive";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: Avatar;
  status: UserStatus;
}

export interface UserInsert {
  name: string;
  email: string;
  avatar?: string;
  status: string;
}

export interface Booking {
  id: number;
  bookingUser: User;
  bookingDate: Date;
  bookingTime: string;
  bookingDuration: BookingDuration;
  bookingStatus: BookingStatus;
  bookingParticipants: User[];
}

export type BookingDuration = 60 | 90;
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Period = "daily" | "weekly" | "monthly";

export interface Range {
  start: Date;
  end: Date;
}
