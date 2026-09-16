import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User } from "@/lib/users/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
import {
  ChangePwdFormValues,
  CurrentUserFormValues,
  DeleteFormValues,
} from "@/lib/account/schemas/account";

const {
  api: {
    rest: {
      endpoints: { account: accountUrl },
    },
  },
} = proxyEnvironment;

export async function updateMyProfile(
  payload: CurrentUserFormValues,
): Promise<Result<User, ApiError>> {
  const { data } = await frontendHttp().patch<Result<User, ApiError>>(
    accountUrl,
    payload,
  );

  return data;
}

export async function changeMyPassword(
  payload: ChangePwdFormValues,
): Promise<Result<User, ApiError>> {
  const { data } = await frontendHttp().post<Result<User, ApiError>>(
    accountUrl,
    payload,
  );

  return data;
}

export async function deleteMyAccount(
  payload: DeleteFormValues,
): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().delete<Result<void, ApiError>>(
    accountUrl,
    { data: payload },
  );

  return data;
}
