import axiosInstance from './client';

type ShiftTypeResponseDTO = Omit<Shift, 'startTime' | 'endTime'> & {
  startTime: string;
  endTime: string;
};

type ShiftTypesResponseDTO = {
  shiftTypes: ShiftTypeResponseDTO[];
};

export type ShiftTypeRequestDTO = Omit<Shift, 'accountShiftTypeId' | 'startTime' | 'endTime'> & {
  startTime: string;
  endTime: string;
};

export const getShiftTypes = async (userId: number) => {
  return (await axiosInstance.get<ShiftTypesResponseDTO>(`/account/${userId}/shift-types`)).data;
};

export const addShiftType = async (userId: number, shift: ShiftTypeRequestDTO) => {
  return (await axiosInstance.post<ShiftTypeResponseDTO>(`/account/${userId}/shift-types`, shift))
    .data;
};

export const editShiftType = async (
  userId: number,
  shiftId: number,
  shift: ShiftTypeRequestDTO,
) => {
  return (
    await axiosInstance.put<ShiftTypeResponseDTO>(
      `/account/${userId}/shift-types/${shiftId}`,
      shift,
    )
  ).data;
};

export const deleteShiftType = async (userId: number, shiftId: number) => {
  return await axiosInstance.delete(`/account/${userId}/shift-types/${shiftId}`);
};
