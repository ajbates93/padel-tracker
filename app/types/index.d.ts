import type { Avatar } from "#ui/types";

export type UserStatus = "active" | "inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

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
