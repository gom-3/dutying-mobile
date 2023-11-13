import axios from 'axios';
import { navigate } from '@libs/utils/navigate';
import { useAccountStore } from 'store/account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import Toast from 'react-native-toast-message';

export const API_URL =
process.env.NODE_ENV === 'production' ? 'https://api.dutying.net' : 'https://dev.api.dutying.net';
// export const API_URL = 'https://dev.api.dutying.net';

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
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch {
          navigate('Login');
        }
      } else {
        if (error.response.status !== 403) {
          Toast.show({
            type: 'error',
            text1:
              error.response.data && error.response.data.message
                ? error.response.data.message
                : '서버에서 문제가 발생했습니다.',
            text2:
              error.response.data && error.response.data.message
                ? ''
                : '잠시 후 다시 시도해주세요.',
            visibilityTime: 2000,
          });
        }
        if (error.config) {
          console.log(error);

          console.log(error.config.url);
          throw error.config.url;
        }
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
