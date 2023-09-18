import axiosInstance from './client';

type OAuthResponseDTO = Pick<Account, 'accountId' | 'email' | 'name'> & { isNewAccount: boolean };

export const oAuthLogin = async (idToken: string, provider: string) => {
  return (
    await axiosInstance.post<OAuthResponseDTO>(`/oauth/id_token`, {
      idToken,
      provider,
    })
  ).data;
};
