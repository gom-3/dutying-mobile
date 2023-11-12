import axiosInstance from './client';

export const getWardByCode = async (code: string) =>
  (await axiosInstance.get<Ward>(`/wards/search?code=${code}`)).data;

export const addMeToWatingNurses = async (wardId: number) =>
  (await axiosInstance.post(`/wards/${wardId}/waiting-nurses`)).data;

export const deleteWatingNurses = async (wardId: number, nurseId: number) =>
  (await axiosInstance.delete(`/wards/${wardId}/waiting-nurses?nurseId=${nurseId}`)).data;

export type WardShift = Omit<Shift, 'isAlarm' | 'alarmInfoList' | 'isDefault'>;
export type WardUser = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;

export type WardShiftsDTO = (WardUser & {
  accountShiftTypes: WardShift[];
})[];

export const getWardShiftCollection = async (
  wardId: number,
  shiftTeamId: number,
  year: number,
  month: number,
) => {
  return (
    await axiosInstance.get<WardShiftsDTO>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/duty/mobile?year=${year}&month=${month + 1}`,
    )
  ).data;
};

export const getWardShiftRequest = async (
  wardId: number,
  shiftTeamId: number,
  year: number,
  month: number,
) => {
  return (
    await axiosInstance.get<WardShiftsDTO>(
      `/wards/${wardId}/shift-teams/${shiftTeamId}/req-duty/mobile?year=${year}&month=${month + 1}`,
    )
  ).data;
};

export const getWardMembers = async (wardId: number, shiftTeamId: number) => {
  return (
    await axiosInstance.get<WardUser[]>(
      `wards/${wardId}/shift-teams/${shiftTeamId}/accounts/linked`,
    )
  ).data;
};
