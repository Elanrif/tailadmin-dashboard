"use server";

import { revalidatePath } from "next/cache";
import { User } from "./types";
import { createUser, deleteUser, updateUser } from "./services/user.server";
import { UserCreatePayload, UserUpdatePayload } from "../schemas/user";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

export async function createUserAction(
  data: UserCreatePayload,
): Promise<Result<User, ApiError>> {
  const result = await createUser(data);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}

export async function updateUserAction(
  id: number,
  data: UserUpdatePayload,
): Promise<Result<User, ApiError>> {
  const result = await updateUser(id, data);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}

export async function deleteUserAction(
  id: number,
): Promise<Result<void, ApiError>> {
  const result = await deleteUser(id);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}
