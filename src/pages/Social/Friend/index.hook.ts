import { useLinkProps } from '@react-navigation/native';
import { useAccountStore } from 'store/account';
import { useCaledarDateStore } from 'store/calendar';
import { useFriendStore } from './store';
import { useEffect, useMemo, useState } from 'react';
import { getFriendsList } from '@libs/api/friend';
import { getCurrentWeekIndex } from '@libs/utils/date';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccount } from '@libs/api/account';
import { firebaseLogEvent } from '@libs/utils/event';

const useFriendPage = () => {
  const [account, setAccountState] = useAccountStore((state) => [state.account, state.setState]);
  const { onPress: navigateMoimPage } = useLinkProps({ to: { screen: 'Moim' } });
  const { onPress: navigateRequestPage } = useLinkProps({ to: { screen: 'RequestFriend' } });
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [weeks, initCalendar] = useFriendStore((state) => [state.weeks, state.initCalendar]);
  const [isBottomSheetOpen, setFriendState] = useFriendStore((state) => [
    state.isBottomSheetOpen,
    state.setState,
  ]);
  const [isIniviteModalOpen, setIsInviteModalOpen] = useState(false);
  const currentWeek = getCurrentWeekIndex(date, weeks);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const year = date.getFullYear();
  const month = date.getMonth();

  const { data: accountData } = useQuery(
    ['getAccount', account.accountId],
    () => getAccount(),
    {
      enabled: !account.code,
    },
  );

  const { data: friends } = useQuery(['getFriendsList'], () => getFriendsList());

  const favoriteFriends = useMemo(() => {
    return friends?.filter((friend) => friend.isFavorite);
  }, [friends]);

  const pressBackdrop = () => {
    setFriendState('isBottomSheetOpen', false);
    queryClient.invalidateQueries(['getFriendCollection', year, month]);
    queryClient.refetchQueries(['getFriendCollection', year, month]);
  };

  const pressInvite = () => {
    firebaseLogEvent('friend_code_invite');
    setIsInviteModalOpen(true);
  };

  const pressAddFriend = () => {
    firebaseLogEvent('friend_add');
    navigateRequestPage();
  };

  useEffect(() => {
    if (accountData) setAccountState('account', accountData);
  }, [accountData]);

  useEffect(() => {
    initCalendar(year, month);
  }, [year, month]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    states: {
      friends,
      date,
      currentWeek,
      favoriteFriends,
      account,
      isIniviteModalOpen,
      isBottomSheetOpen,
      isLoading,
    },
    actions: {
      pressBackdrop,
      setIsInviteModalOpen,
      navigateMoimPage,
      navigateRequestPage,
      setState,
      pressInvite,
      pressAddFriend
    },
  };
};

export default useFriendPage;
