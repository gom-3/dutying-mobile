import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { createMoim, getMoimList } from '@libs/api/moim';
import { useLinkProps } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useAccountStore } from 'store/account';
import { useMoimStore } from './store';

const useMoimPage = () => {
  const [accountId] = useAccountStore((state) => [state.account.accountId]);
  const { onPress: navigateDetailMoim } = useLinkProps({ to: { screen: 'MoimDetail' } });
  const { onPress: navigateMoimEnter } = useLinkProps({ to: { screen: 'MoimEnter' } });
  const textInputRef = useRef<string>('');
  const queryClient = useQueryClient();
  const [isValid, setIsValid] = useState(true);
  const createRef = useRef<BottomSheetModal>(null);
  const [setMoimState] = useMoimStore((state) => [state.setState]);

  const { mutate: createMoimMutate } = useMutation(() => createMoim(textInputRef.current), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      createRef.current?.close();
    },
    onError: () => {
      setIsValid(false);
    },
  });

  const pressCheck = () => {
    createMoimMutate();
  };

  const { data: moimList } = useQuery(['getMoimList', accountId], () => getMoimList());

  const pressMoimCard = (moimId: number, moimCode: string) => {
    setMoimState('moimId', moimId);
    setMoimState('moimCode', moimCode);
    navigateDetailMoim();
  };

  return {
    states: { isValid, createRef, moimList, textInputRef },
    actions: { setIsValid, pressMoimCard, pressCheck, navigateMoimEnter },
  };
};

export default useMoimPage;
