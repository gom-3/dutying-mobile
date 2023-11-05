import { dateToString, yearMonthToDateString } from '@libs/utils/date';
import axiosInstance from './client';

export type Friend = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'> & {
  isFavorite: boolean;
};

type FriendCollectionResponseDTO = (Friend & {
  accountShiftTypes: (Pick<Shift, 'shortName' | 'name' | 'classification' | 'color'> & {
    date: string;
    startTime: string;
    endTime: string;
    dateDiff: number;
  })[];
})[];

export const getFriendCollection = async (year: number, month: number) => {
  const [startDateString, endDateString] = yearMonthToDateString(year, month);
  return (
    await axiosInstance.get<FriendCollectionResponseDTO>(
      `/friends/collect?startDate=${startDateString}&endDate=${endDateString}`,
    )
  ).data;
};

export const getFriendsTodayShifts = async () => {
  const today = new Date();
  const dateString = dateToString(today);
  return (
    await axiosInstance.get<FriendCollectionResponseDTO>(
      `/friends/collect?startDate=${dateString}&endDate=${dateString}`,
    )
  ).data;
};

export const getFriendsList = async () => {
  return (await axiosInstance.get<Friend[]>(`/friends`)).data;
};

export const sendRequestFriend = async (friendId: number) => {
  await axiosInstance.post(`/friends/invite/${friendId}`);
};

export const deleteFriend = async (friendId: number) => {
  await axiosInstance.delete(`/friends/${friendId}`);
};

export const registFavoriteFriend = async (friendId: number) => {
  await axiosInstance.post(`/friends/favorite/${friendId}`);
};
export const deleteFavoriteFriend = async (friendId: number) => {
  await axiosInstance.delete(`/friends/favorite/${friendId}`);
};

export const acceptRequestFriend = async (friendId: number) => {
  await axiosInstance.patch(`/friends/accept/${friendId}`);
};
export const refuseRequestFriend = async (friendId: number) => {
  await axiosInstance.patch(`/friends/refuse/${friendId}`);
};

export type SearchFriendCodeResponseDTO = Omit<Friend, 'isFavorite'>;

export const searchFriendCode = async (code: string) => {
  return (await axiosInstance.get<SearchFriendCodeResponseDTO>(`/accounts/search?code=${code}`))
    .data;
};
