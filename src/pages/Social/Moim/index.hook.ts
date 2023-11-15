import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { createMoim, getMoimList } from '@libs/api/moim';
import { useLinkProps } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useAccountStore } from 'store/account';
import { useMoimStore } from './store';
import Toast from 'react-native-toast-message';
import { firebaseLogEvent } from '@libs/utils/event';

const useMoimPage = () => {
  const [accountId] = useAccountStore((state) => [state.account.accountId]);
  const { onPress: navigateDetailMoim } = useLinkProps({ to: { screen: 'MoimDetail' } });
  const { onPress: navigateMoimEnter } = useLinkProps({ to: { screen: 'MoimEnter' } });
  const { onPress: navigateFriendsPage } = useLinkProps({ to: { screen: 'Friends' } });
  const moimNameRef = useRef<string>('');
  const queryClient = useQueryClient();
  const [isValid, setIsValid] = useState(true);
  const createRef = useRef<BottomSheetModal>(null);
  const [setMoimState] = useMoimStore((state) => [state.setState]);

  const { mutate: createMoimMutate, isLoading: createLoading } = useMutation(
    () => createMoim(moimNameRef.current),
    {
      onSuccess: () => {
        firebaseLogEvent('make_moim');
        queryClient.invalidateQueries(['getMoimList', accountId]);
        queryClient.refetchQueries(['getMoimList', accountId]);
        closeBottomSheet();
        Toast.show({
          type: 'success',
          text1: '모임이 생성되었어요!',
          text2: '코드를 공유해 사람들을 초대할 수 있어요👋',
          visibilityTime: 3000,
        });
      },
      onError: () => {
        setIsValid(false);
      },
    },
  );

  const closeBottomSheet = () => {
    createRef.current?.close();
    moimNameRef.current = '';
  };

  const pressCheck = () => {
    createMoimMutate();
  };

  const {
    data: moimList,
    isLoading,
    isRefetching,
  } = useQuery(['getMoimList', accountId], () => getMoimList());

  const pressEnterMoim = () => {
    firebaseLogEvent('enter_moim');
    navigateMoimEnter();
  };

  const pressMoimCard = (moimId: number, moimCode: string) => {
    setMoimState('moimId', moimId);
    setMoimState('moimCode', moimCode);
    navigateDetailMoim();
  };

  return {
    states: { createLoading, isValid, createRef, moimList, moimNameRef, isLoading, isRefetching },

    actions: {
      setIsValid,
      pressMoimCard,
      pressCheck,
      navigateMoimEnter,
      closeBottomSheet,
      navigateFriendsPage,
      pressEnterMoim
    },
  };
};

export default useMoimPage;
