import { getUserById, updateUser } from "~~/server/db/users";

export default defineEventHandler(async (event) => {
  // Get the user ID from the query params
  const userId = event.context.params?.id as string;

  if (!userId) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  // Get the updated user data from the request body
  const { name, email, avatar, status } = await readBody(event);

  // Check if the user exists
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    return {
      success: false,
      error: "User not found.",
    };
  }

  // Prepare the update object
  const updateData = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(avatar !== undefined && { avatar }),
    ...(status !== undefined && { status }),
    updated_at: new Date(),
  };

  // Only update if there are changes
  if (Object.keys(updateData).length === 0) {
    return {
      success: false,
      error: "No updates provided.",
    };
  }

  // Update the user
  const updatedUser = await updateUser(userId, updateData);

  if (updatedUser) {
    return {
      success: true,
      data: updatedUser,
    };
  } else {
    return {
      success: false,
      error: "Could not update user.",
    };
  }
});
