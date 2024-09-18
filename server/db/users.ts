import type { User } from "~/types";

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

export const getAllUsers = () => {
  return users;
};

export const getUserById = (id: number) => {
  return users.find((user) => user.id === id);
};
