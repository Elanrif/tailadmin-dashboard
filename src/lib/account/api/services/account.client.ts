import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User } from "@/lib/users/api/types";
import {
  ChangePwdFormValues,
  CurrentUserFormValues,
  DeleteFormValues,
} from "@/lib/account/schemas/account";
import { unwrapApiError } from "@/lib/shared/handle-api-error";

const {
  api: {
    rest: {
      endpoints: { account: accountUrl },
    },
  },
} = proxyEnvironment;

// --- Mutations ---

export async function updateMyProfile(
  payload: CurrentUserFormValues,
): Promise<User> {
  try {
    const res = await frontendHttp().patch<User>(accountUrl, payload);
    return res.data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function changeMyPassword(
  payload: ChangePwdFormValues,
): Promise<void> {
  try {
    await frontendHttp().post(accountUrl, payload);
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function deleteMyAccount(
  payload: DeleteFormValues,
): Promise<void> {
  try {
    await frontendHttp().delete(accountUrl, { data: payload });
  } catch (error) {
    throw unwrapApiError(error);
  }
}
