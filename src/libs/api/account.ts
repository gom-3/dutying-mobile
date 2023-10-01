import axiosInstance, { AccessToken } from './client';

export type OAuthResponseDTO = Pick<Account, 'accountId' | 'email' | 'name' | 'status'> &
  AccessToken;
export type SignupRequestDTO = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;

export const oAuthLogin = async (idToken: string, provider: string) => {
  const data = (
    await axiosInstance.post<OAuthResponseDTO>(`/oauth/id-token`, {
      idToken,
      provider,
    })
  ).data;
  console.log(data);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  return data;
};

export const editAccount = async (accountId: number, name: string, profileImgBase64: string) => {
  console.log(accountId, name, profileImgBase64);
  return (
    await axiosInstance.put<Account>(`/accounts/${accountId}`, {
      name,
      profileImgBase64,
    })
  ).data;
};

export const getAccount = async (accountId: number) => {
  return (await axiosInstance.get<Account>(`/accounts/${accountId}`)).data;
};

export const changeAccountStatus = async (
  accountId: number,
  status: 'NURSE_INFO_PENDING' | 'INITIAL',
) => {
  console.log(accountId);
  return (await axiosInstance.patch(`/accounts/${accountId}/status?status=${status}`)).data;
};
