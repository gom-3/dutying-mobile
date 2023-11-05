import axiosInstance from './client';

export const getWardByCode = async (code: string) =>
  (await axiosInstance.get<Ward>(`/wards/search?code=${code}`)).data;

export const addMeToWatingNurses = async (wardId: number) =>
  (await axiosInstance.post(`/wards/${wardId}/waiting-nurses`)).data;

export const deleteWatingNurses = async (wardId: number, nurseId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/waiting-nurses?nurseId=${nurseId}`)).data;
