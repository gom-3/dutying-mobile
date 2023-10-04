import axios from 'axios';
import { navigate } from '@libs/utils/navigate';
import { useAccountStore } from 'store/account';

interface Cookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  version?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
}

interface Cookies {
  [key: string]: Cookie;
}

const axiosInstance = axios.create({
  baseURL: 'https://api.dutying.net',
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
        return {
          code: '400',
          message: '400',
        };
      }
      if (error.response.status === 401) {
        try {
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
  const data = (await axios.post<AccessToken>(`https://api.dutying.net/token/refresh`)).data;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  useAccountStore.getState().setState('accessToken', data.accessToken);

  return data.accessToken;
};

export default axiosInstance;
