import type { Avatar } from "#ui/types";

export type UserStatus = "active" | "inactive";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: Avatar;
  status: UserStatus;
}
