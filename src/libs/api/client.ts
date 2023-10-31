import axios from 'axios';
import { navigate } from '@libs/utils/navigate';
import { useAccountStore } from 'store/account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { Alert } from 'react-native';

export const API_URL = 'https://api.dutying.net';

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
          originalRequest.headers['Authorization'] = `Bearer $${accessToken}`;
          return axiosInstance(originalRequest);
        } catch {
          navigate('Login');
        }
      } else {
        Alert.alert(
          error.response.data ? error.response.data.message : '서버에서 에러가 발생했습니다.',
        );
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
