import axios from 'axios';
import { navigate } from '@libs/utils/navigate';
import { useAccountStore } from 'store/account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
// import Constants from 'expo-constants';
// let CookieManager: any;

// if (Constants.appOwnership !== 'expo') {
//   CookieManager = require('@react-native-cookies/cookies').default;
// }

export const API_URL = 'https://dev.api.dutying.net';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.log(error);
      if (error.response.status === 400) {
        throw {
          code: '400',
          message: '400',
        };
      }
      if (error.response.status === 401) {
        try {
          // refreshToken Check
          const { refreshToken } = await CookieManager.get(API_URL);
          if (!refreshToken) {
            const refreshTokenValue = await AsyncStorage.getItem('refresh');
            const refreshTokenExpires = await AsyncStorage.getItem('refreshExpires');
            CookieManager.set(API_URL, {
              name: 'refreshToken',
              value: refreshTokenValue || '',
              domain: 'api.dutying.net',
              path: '/',
              secure: true,
              version: '0',
              httpOnly: true,
              expires: refreshTokenExpires || '',
            });
          }

          // refresh
          const accessToken = await refresh();
          const originalRequest = error.config;
          originalRequest.headers['Authorization'] = `Bearer $${accessToken}`;
          return axiosInstance(originalRequest);
        } catch {
          navigate('Login');
        }
      }
      if (error.response.status === 403) {
        return {
          code: '403',
          message: '403',
        };
      }
      if (error.response.status === 404) {
        return {
          code: '404',
          message: '404',
        };
      }
    }
    return Promise.reject(error);
  },
);

export type AccessToken = { accessToken: string };

export const refresh = async () => {
  const data = (await axios.post<AccessToken>(`${API_URL}/token/refresh`)).data;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  useAccountStore.getState().setState('accessToken', data.accessToken);

  return data.accessToken;
};

export default axiosInstance;
