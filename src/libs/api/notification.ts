import axiosInstance from './client';

export const getNotifications = async () => {
  return (await axiosInstance.get<PushNotification[]>('/notifications')).data;
};
