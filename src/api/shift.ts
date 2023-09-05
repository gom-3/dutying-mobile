import axiosInstance from './client';

export type CreateShiftTypeDTO = Omit<Shift, 'accountShiftTypeId'>;

type ShiftTypeResponse = {
  shiftTypes: (Omit<Shift, 'startTime' | 'endTime'> & { startTime: string; endTime: string })[];
};

export const getShiftTypes = async (userId: number) => {
  return (await axiosInstance.get<ShiftTypeResponse>(`/account/${userId}/shift-types`)).data
    .shiftTypes;
};
