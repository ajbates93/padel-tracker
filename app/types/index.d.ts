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
  date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  user: User;
  time: string;
  duration: number;
}

export type BookingDuration = 60 | 90;
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Period = "daily" | "weekly" | "monthly";

export interface Range {
  start: Date;
  end: Date;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
