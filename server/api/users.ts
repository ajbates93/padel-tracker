import type { User, UserStatus } from "~/types";

const users: User[] = [
  {
    id: 1,
    name: "Alex Bates",
    email: "ajbates93@gmail.com",
    status: "active",
    avatar: {
      src: "https://i.pravatar.cc/128?u=1",
    },
  },
  {
    id: 2,
    name: "Frank Page",
    email: "fpage92@gmail.com",
    status: "active",
    avatar: {
      src: "https://i.pravatar.cc/128?u=2",
    },
  },
  {
    id: 3,
    name: "Roger Williams",
    email: "rogerw@gmail.com",
    status: "inactive",
    avatar: {
      src: "https://i.pravatar.cc/128?u=3",
    },
  },
  {
    id: 4,
    name: "Joe Osman",
    email: "josephosman@gmail.com",
    status: "active",
    avatar: {
      src: "https://i.pravatar.cc/128?u=4",
    },
  },
];

export default defineEventHandler(async (event) => {
  const { q, statuses, sort, order } = getQuery(event) as {
    q?: string;
    statuses?: UserStatus[];
    sort?: "name" | "email";
    order?: "asc" | "desc";
  };

  await new Promise(function (resolve) {
    setTimeout(resolve, 500);
  });

  return users
    .filter((user) => {
      if (!q) return true;

      return (
        user.name.search(new RegExp(q, "i")) !== -1 ||
        user.email.search(new RegExp(q, "i")) !== -1
      );
    })
    .filter((user) => {
      if (!statuses) return true;
      return statuses.includes(user.status);
    })
    .sort((a, b) => {
      if (!sort) return 0;
      console.log(sort, order);

      const aValue = a[sort];
      const bValue = b[sort];

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
});
