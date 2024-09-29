import type { UserStatus } from "~/types";

import { getAllUsers } from "../db/users";

export default defineEventHandler(async (event) => {
  const { q, statuses, sort, order } = getQuery(event) as {
    q?: string;
    statuses?: UserStatus[];
    sort?: "name" | "email";
    order?: "asc" | "desc";
  };

  const users = await getAllUsers();

  return users
    .filter((user) => {
      if (!q) return true;

      return (
        user.name.search(new RegExp(q, "i")) !== -1 ||
        user.email?.search(new RegExp(q, "i")) !== -1
      );
    })
    .filter((user) => {
      if (!statuses) return true;

      const xStatuses = statuses as string[];
      return xStatuses.includes(user.status);
    })
    .sort((a, b) => {
      if (!sort) return 0;

      const aValue = a[sort];
      const bValue = b[sort];

      if (aValue! < bValue!) return order === "asc" ? -1 : 1;
      if (aValue! > bValue!) return order === "asc" ? 1 : -1;
      return 0;
    });
});
