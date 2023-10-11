import axios from 'axios';
import axiosInstance, { API_URL, AccessToken } from './client';
import { useAccountStore } from 'store/account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';

// import Constants from 'expo-constants';
// let CookieManager: any;

// if (Constants.appOwnership !== 'expo') {
//   CookieManager = require('@react-native-cookies/cookies').default;
// }

export type OAuthResponseDTO = Pick<Account, 'accountId' | 'email' | 'name' | 'status'> &
  AccessToken;
export type SignupRequestDTO = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;

export const oAuthLogin = async (idToken: string, provider: string) => {
  const data = (
    await axios.post<OAuthResponseDTO>(`${API_URL}/oauth/id-token`, {
      idToken,
      provider,
    })
  ).data;
  useAccountStore.getState().setState('accessToken', data.accessToken);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  const { refreshToken } = await CookieManager.get(API_URL);
  AsyncStorage.setItem('refresh', refreshToken.value);
  AsyncStorage.setItem('refreshExpires', refreshToken.expires || '');
  return data;
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

export const changeAccountStatus = async (
  accountId: number,
  status: 'NURSE_INFO_PENDING' | 'INITIAL',
) => {
  return (await axiosInstance.patch(`/accounts/${accountId}/status?status=${status}`)).data;
};

export type DemoLoginResponseDTO = { accessToken: string };

export const demoLogin = async () => {
  return (await axios.get<DemoLoginResponseDTO>(`${API_URL}/demo/login?email=test@demotest.dutyin`))
    .data;
};

export const deleteAccount = async (accountId: number) => {
  await axiosInstance.delete(`/accounts/${accountId}`);
};
