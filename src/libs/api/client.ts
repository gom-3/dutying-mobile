import axios from 'axios';
import { navigate } from '@libs/utils/navigate';

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
  // 에러가 발생하면 각 에러에 대한 처리
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        return {
          code: '400',
          message: '400',
        };
      }
      if (error.response.status === 401) {
        // 토큰 만료되었을 때 refreshToken으로 accessToken 재발급
        refresh();
        return {
          code: '401',
          message: '401',
        };
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
  try {
    const data = (await axiosInstance.post<AccessToken>(`/token/refresh`)).data;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  } catch {
    navigate('Login');
  }
};

export default axiosInstance;
