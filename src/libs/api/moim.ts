import { yearMonthToDateString } from '@libs/utils/date';
import axiosInstance from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 모임 만들기
export const createMoim = async (name: string) => {
  return (
    await axiosInstance.post('/moims', {
      name,
      isPublic: true,
    })
  ).data;
};

// 모임 리스트 가져오기
export const getMoimList = async () => {
  return (await axiosInstance.get<Moim[]>('/moims')).data;
};

// 모임원 정보 가져오기
export type MoimDetailResponseDTO = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>[];
export const getMoimMembers = async (moimId: number) => {
  return (await axiosInstance.get<Moim>(`/moims/${moimId}`)).data;
};

// 모임 탈퇴하기
export const withdrawMoim = async (moimId: number) => {
  await axiosInstance.post(`/moims/${moimId}/withdraw`);
};

// 모임 추방하기
export const kickMemberFromMoim = async (moimId: number, accountId: number) => {
  await axiosInstance.post(`/moims/${moimId}/kickout?accountId=${accountId}`);
};

// 모임장 변경
export const changeMoimHost = async (moimId: number, accountId: number) => {
  await axiosInstance.post(`/moims/${moimId}/change-host?nextHostId=${accountId}`);
};

// 모임 삭제하기
export const deleteMoim = async (moimId: number) => {
  await axiosInstance.delete(`moims/${moimId}`);
};

// 모임 모아보기, 요약보기 정보 가져오기
export const getMoimCollection = async (moimId: number, year: number, month: number) => {
  const [startDateString, endDateString] = yearMonthToDateString(year, month);
  return (
    await axiosInstance.get<Collection>(
      `/moims/${moimId}/collect?startDate=${startDateString}&endDate=${endDateString}`,
    )
  ).data;
};

// 모임 코드로 모임 정보 조회하기
export type SearchMoimFromCodeResponseDTO = Pick<
  Moim,
  'moimId' | 'moimName' | 'isPublic' | 'hostInfo'
>;
export const searchMoimCode = async (moimCode: string) => {
  return (await axiosInstance.get<SearchMoimFromCodeResponseDTO>(`/moims/search?code=${moimCode}`))
    .data;
};

// 모임 코드로 얻은 id로 모임 가입하기
export const joinMoim = async (moimId: number, accountId: number) => {
  return await axiosInstance.post(`/moims/${moimId}/join?accountId=${accountId}`);
};

// 모임 이름 변경하기
export const changeMoimName = async (moimId: number, name: string) => {
  await axiosInstance.patch(`/moims/${moimId}`, { name });
};
