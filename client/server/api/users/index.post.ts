import { createUser } from "~~/server/db/users";

export default defineEventHandler(async (event) => {
  const { name, email, avatar, status } = await readBody(event);

  const newUser = {
    name: name,
    email: email,
    avatar: avatar,
    status: status || "inactive",
  };

  const response = createUser(newUser);

  if (response) {
    return {
      success: true,
      data: response,
    };
  } else {
    return {
      success: false,
      error: "Could not create new user.",
    };
  }
});
