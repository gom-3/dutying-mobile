import axiosInstance from './client';

export const getWardByCode = async (code: string) =>
  (await axiosInstance.get<Ward>(`/wards/search?code=${code}`)).data;

export const addMeToWatingNurses = async (wardId: number) =>
  (await axiosInstance.post(`/wards/${wardId}/waiting-nurses`)).data;

export const deleteWatingNurses = async (wardId: number, nurseId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/waiting-nurses?nurseId=${nurseId}`)).data;

export const getWardShiftCollection = async (wardId: number, shiftTeamId: number) => {
  return (await axiosInstance.get(`/wards/${wardId}/shift-teams/${shiftTeamId}/duty/mobile`)).data;
};
