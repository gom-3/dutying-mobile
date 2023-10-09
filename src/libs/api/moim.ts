import { yearMonthToDateString } from '@libs/utils/date';
import axiosInstance from './client';

export const createMoim = async (name: string) => {
  return (
    await axiosInstance.post('/moims', {
      name,
      isPublic: true,
    })
  ).data;
};

export const getMoimList = async () => {
  return (await axiosInstance.get<Moim[]>('/moims')).data;
};

export const getMoimInfo = async (moimId: number) => {
  return (await axiosInstance.get<Moim>(`/moims/${moimId}`)).data;
};

export type MoimDetailResponseDTO = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>[];

export const getMoimMembers = async (moimId: number) => {
  return (await axiosInstance.get<Moim>(`/moims/${moimId}`)).data;
};

export const withdrawMoim = async (moimId: number) => {
  await axiosInstance.post(`/moims/${moimId}/withdraw`);
};

export const deleteMoim = async (moimId: number) => {
  await axiosInstance.delete(`moims/${moimId}`);
};

export const getMoimCollection = async (moimId: number, year: number, month: number) => {
  const [startDateString, endDateString] = yearMonthToDateString(year, month);
  return (
    await axiosInstance.get<Collection>(
      `/moims/${moimId}/collect?startDate=${startDateString}&endDate=${endDateString}`,
    )
  ).data;
};

export type SearchMoimFromCodeResponseDTO = Pick<
  Moim,
  'moimId' | 'moimName' | 'isPublic' | 'hostInfo'
>;

export const searchMoimCode = async (moimCode: string) => {
  console.log(moimCode);
  return (await axiosInstance.get<SearchMoimFromCodeResponseDTO>(`/moims/search?code=${moimCode}`))
    .data;
};

export const joinMoim = async (moimId: number, accountId: number) => {
  return await axiosInstance.post(`/moims/${moimId}/join?accountId=${accountId}`);
};
