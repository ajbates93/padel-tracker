export default defineTask({
  meta: {
    name: "seed",
    description: "Run database seed task",
  },
  async run() {
    console.log("Running DB seed task...");
    const users = [
      {
        name: "Alex Bates",
        email: "ajbates93@gmail.com",
        avatar: "https://i.pravatar.cc/128?u=1",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "Frank Page",
        email: "fpage92@gmail.com",
        avatar: "https://i.pravatar.cc/128?u=2",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "Roger Williams",
        email: "rogerw@gmail.com",
        avatar: "https://i.pravatar.cc/128?u=3",
        status: "inactive",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        name: "Joe Osman",
        email: "josephosman@gmail.com",
        avatar: "https://i.pravatar.cc/128?u=4",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ];

    await useDrizzle().insert(tables.users).values(users);
    return { result: "success" };
  },
});
