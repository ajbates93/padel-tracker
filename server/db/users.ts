const db = useDrizzle();

export const getAllUsers = async () => {
  const users = await db.select().from(tables.users);

  return users;
};

export const getUserById = async (id: string) => {
  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, id));

  return user;
};

export const createUser = async (user: {
  name: string;
  email: string;
  avatar: string;
}) => {
  const newUser = await db.insert(tables.users).values(user).returning();

  return newUser;
};
