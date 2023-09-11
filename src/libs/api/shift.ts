import axiosInstance from './client';

type AccountShiftListResponse = {
  accountShiftTypeIdList: (number | null)[];
};

export const getAccountShiftList = async (userId: number, year: number, month: number) => {
  const startDay = new Date(year, month, 1).getDay() - 1;
  const endDay = new Date(year, month + 1, 1).getDay();
  const startDate = new Date(year, month, -startDay);
  const endDate = new Date(year, month + 1, endDay);
  const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
  const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
  return (
    await axiosInstance.get<AccountShiftListResponse>(
      `/account/${userId}/shifts?startDate=${startDateString}&endDate=${endDateString}`,
    )
  ).data;
};

export type AccountShiftRequest = Pick<Shift, 'accountShiftTypeId'> & { shiftDate: string };

export type AccountShiftListRequestDTO = {
  accountShifts: AccountShiftRequest[];
};

export const editAccountShiftList = async (
  userId: number,
  shiftList: AccountShiftListRequestDTO,
) => {
  await axiosInstance.patch(`/account/${userId}/shifts/list`, shiftList);
};
