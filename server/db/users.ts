
const db = useDrizzle()

export const getAllUsers = async () => {
  const users = await db.select().from(tables.users);

  return users;
};

export const getUserById = async (id: number) => {
  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, id));

  return user;
};

export const createUser = async (user: UserInsert) => {
  const newUser = await db 
    .insert(tables.users)
    .values(user)
    .returning()

  return newUser;
};
