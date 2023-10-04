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
  const textInputRef = useRef<string>('');
  const queryClient = useQueryClient();
  const createRef = useRef<BottomSheetModal>(null);
  const [enteredInput, setEnteredInput] = useState('');
  const [setMoimState] = useMoimStore((state) => [state.setState]);

  const { mutate: createMoimMutate } = useMutation(() => createMoim(textInputRef.current), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
    },
  });
  const pressCheck = () => {
    console.log(textInputRef.current);
    createMoimMutate();
    createRef.current?.close();
  };
  const { data: moimList } = useQuery(['getMoimList', accountId], () => getMoimList());

  const pressMoimCard = (moimId: number) => {
    setMoimState('moimId', moimId);
    navigateDetailMoim();
  };

  return {
    states: { enteredInput, createRef, moimList, textInputRef },
    actions: { setEnteredInput, pressMoimCard, pressCheck, setMoimState },
  };
};

export default useMoimPage;
