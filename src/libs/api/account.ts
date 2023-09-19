import axiosInstance from './client';

type OAuthResponseDTO = Pick<Account, 'accountId' | 'email' | 'name'> & { isNewAccount: boolean };
export type SignupRequestDTO = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;

export const oAuthLogin = async (idToken: string, provider: string) => {
  return (
    await axiosInstance.post<OAuthResponseDTO>(`/oauth/id_token`, {
      idToken,
      provider,
    })
  ).data;
};

export const editAccount = async (accountId: number, name: string, profileImgBase64: string) => {
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

export const changeAccountStatus = async (accountId: number, status: 'ACTIVE' | 'INITIAL') => {
  return (await axiosInstance.patch(`/accounts/${accountId}/status?status=${status}`)).data;
};
