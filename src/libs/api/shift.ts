import { yearMonthToDateString } from '@libs/utils/date';
import axiosInstance from './client';

type AccountShiftListResponse = {
  accountShiftTypeIdList: (number | null)[];
};

export const getAccountShiftList = async (userId: number, year: number, month: number) => {
  const [startDateString, endDateString] = yearMonthToDateString(year, month);
  return (
    await axiosInstance.get<AccountShiftListResponse>(
      `/accounts/${userId}/shifts?startDate=${startDateString}&endDate=${endDateString}`,
    )
  ).data;
};

export type AccountShiftRequest = {
  shiftDate: string;
  accountShiftTypeId: number | null;
};

export type AccountShiftListRequestDTO = {
  accountShifts: AccountShiftRequest[];
};

export const editAccountShiftList = async (
  userId: number,
  shiftList: AccountShiftListRequestDTO,
) => {
  await axiosInstance.patch(`/accounts/${userId}/shifts/list`, shiftList);
};
