import axiosInstance from './client';

type ShiftTypeResponseDTO = Omit<Shift, 'startTime' | 'endTime'> & {
  startTime: string;
  endTime: string;
};

type ShiftTypesResponseDTO = {
  shiftTypes: ShiftTypeResponseDTO[];
};

export type ShiftTypeRequestDTO = Omit<Shift, 'accountShiftTypeId' | 'startTime' | 'endTime'> & {
  startTime: string | null;
  endTime: string | null;
};

export const getShiftTypesAll = async (userId: number) => {
  return (await axiosInstance.get<ShiftTypeResponseDTO>(`/accounts/${userId}/shift-types/all`))
    .data;
};

export const getShiftTypes = async (userId: number) => {
  return (await axiosInstance.get<ShiftTypesResponseDTO>(`/accounts/${userId}/shift-types`)).data;
};

export const addShiftType = async (userId: number, shift: ShiftTypeRequestDTO) => {
  return (await axiosInstance.post<ShiftTypeResponseDTO>(`/accounts/${userId}/shift-types`, shift))
    .data;
};

export const editShiftType = async (
  userId: number,
  shiftId: number,
  shift: ShiftTypeRequestDTO,
) => {
  return (
    await axiosInstance.put<ShiftTypeResponseDTO>(
      `/accounts/${userId}/shift-types/${shiftId}`,
      shift,
    )
  ).data;
};

export const deleteShiftType = async (userId: number, shiftId: number) => {
  return await axiosInstance.delete(`/accounts/${userId}/shift-types/${shiftId}`);
};
