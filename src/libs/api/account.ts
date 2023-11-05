import axios from 'axios';
import axiosInstance, { API_URL, AccessToken } from './client';
import { useAccountStore } from 'store/account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';

export type OAuthResponseDTO = Pick<Account, 'accountId' | 'email' | 'name' | 'status'> &
  AccessToken;
export type SignupRequestDTO = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;

export const oAuthLogin = async (idToken: string, provider: string, deviceToken: string | null) => {
  const data = (
    await axios.post<OAuthResponseDTO>(`${API_URL}/oauth/token`, {
      idToken,
      provider,
      deviceToken,
    })
  ).data;
  useAccountStore.getState().setState('accessToken', data.accessToken);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  const { refreshToken } = await CookieManager.get(API_URL);
  AsyncStorage.setItem('refresh', refreshToken.value);
  AsyncStorage.setItem('refreshExpires', refreshToken.expires || '');
  return data;
};

export const editProfile = async (name: string, profileImgBase64: string, accountId: number) => {
  return (
    await axiosInstance.put<Account>(`/accounts/${accountId}`, {
      name,
      profileImgBase64,
    })
  ).data;
};

export const initAccount = async (accountId: number, name: string, profileImgBase64: string) => {
  return (
    await axiosInstance.patch<Account>(`/accounts/${accountId}/init`, {
      name,
      profileImgBase64,
    })
  ).data;
};

export const getAccount = async (accountId: number) => {
  return (await axiosInstance.get<Account>(`/accounts/me`)).data;
};

export type DemoLoginResponseDTO = { accessToken: string };

export const demoLogin = async () => {
  return (
    await axios.post<DemoLoginResponseDTO>(`${API_URL}/demo/login?email=test@demotest.dutyin`)
  ).data;
};

export const deleteAccount = async (accountId: number) => {
  await axiosInstance.delete(`/accounts/${accountId}`);
};

export const eidtAccountStatus = async (accountId: number, status: Account['status']) =>
  (await axiosInstance.patch<Account>(`/accounts/${accountId}/status?status=${status}`)).data;

export const getAccountMeWaiting = async () =>
  (await axiosInstance.get<Ward>(`/accounts/waiting`)).data;
