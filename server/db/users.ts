import { UserInsert } from "~/types";

export const getAllUsers = async () => {
  const users = await useDrizzle().select().from(tables.users).all();

  return users;
};

export const getUserById = async (id: number) => {
  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, id));

  return user;
};

export const createUser = async (user: UserInsert) => {
  const newUser = await useDrizzle()
    .insert(tables.users)
    .values(user)
    .returning()
    .get();

  return newUser;
};
