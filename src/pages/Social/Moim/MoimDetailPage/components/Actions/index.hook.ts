import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  changeMoimHost,
  changeMoimName,
  deleteMoim,
  kickMemberFromMoim,
  withdrawMoim,
} from '@libs/api/moim';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useAccountStore } from 'store/account';
import Toast from 'react-native-toast-message';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { firebaseLogEvent } from '@libs/utils/event';

type ActionsAccountType = Pick<Account, 'accountId' | 'name'>;

const useAction = (moim: Moim, close: () => void) => {
  const [member, setMember] = useState<ActionsAccountType>({ accountId: 0, name: '' });
  const [accountId] = useAccountStore((state) => [state.account.accountId]);
  const [moimCode] = useMoimStore((state) => [state.moimCode]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<'invite' | 'delete' | 'kick' | 'host' | 'out' | null>(null);
  const [isValid, setIsValid] = useState(true);

  const navigate = useNavigation();
  const queryClient = useQueryClient();

  const moimNameRef = useRef<string>('');
  const inviteRef = useRef<BottomSheetModal>(null);
  const nameRef = useRef<BottomSheetModal>(null);
  const hostRef = useRef<BottomSheetModal>(null);
  const kickRef = useRef<BottomSheetModal>(null);

  const isHost = moim.hostInfo.accountId === accountId;

  const { mutate: changeMoimNameMutate } = useMutation(
    () => changeMoimName(moim.moimId, moimNameRef.current),
    {
      onSuccess: () => {
        firebaseLogEvent('change_moim_name');
        queryClient.invalidateQueries(['getMoimList', accountId]);
        navigate.goBack();
        Toast.show({
          type: 'success',
          text1: '모임 이름이 변경되었어요!',
          visibilityTime: 2000,
        });
      },
    },
  );

  const { mutate: deleteMoimMutate } = useMutation(() => deleteMoim(moim.moimId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      navigate.goBack();
      Toast.show({
        type: 'success',
        text1: '모임이 삭제되었어요',
        visibilityTime: 2000,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const { mutate: outMoimMutate } = useMutation(() => withdrawMoim(moim.moimId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      navigate.goBack();
      Toast.show({
        type: 'success',
        text1: '모임에서 탈퇴했어요',
        visibilityTime: 2000,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const { mutate: kickMemberMutate } = useMutation(
    (memberId: number) => kickMemberFromMoim(moim.moimId, memberId),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['getMoimCollection', moim.moimId, ])
        queryClient.invalidateQueries(['getMemberList', moim.moimId]);
        setModal(null);
        // setIsKickModalOpen(false);
        kickRef.current?.present();
        Toast.show({
          type: 'success',
          text1: '모임원을 내보냈어요',
          visibilityTime: 2000,
        });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  const { mutate: changeHostMutate } = useMutation(
    (memberId: number) => changeMoimHost(moim.moimId, memberId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getMemberList', moim.moimId]);
        setModal(null);
        // setIsChangeMasterModalOpen(false);
        hostRef.current?.present();
        Toast.show({
          type: 'success',
          text1: '모임장을 변경했어요!',
          visibilityTime: 2000,
        });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  const openBottomSheet = (sheet: 'invite' | 'host' | 'kick' | 'name') => {
    if (sheet === 'invite') inviteRef.current?.present();
    if (sheet === 'host') hostRef.current?.present();
    if (sheet === 'kick') kickRef.current?.present();
    if (sheet === 'name') nameRef.current?.present();
    close();
  };

  const openModal = (
    type: 'invite' | 'delete' | 'kick' | 'host' | 'out',
    ref?: React.RefObject<BottomSheetModalMethods>,
    member?: ActionsAccountType,
  ) => {
    setModal(type);
    close();
    if (ref) ref.current?.close();
    if (member) setMember(member);
  };

  const closeModal = (ref?: React.RefObject<BottomSheetModalMethods>) => {
    setModal(null);
    close();
    if (ref) ref.current?.present();
  };

  const closeNameBottomSheet = () => {
    nameRef.current?.close();
    moimNameRef.current = '';
  };

  const pressKickMemberButton = (id: number) => {
    if (isLoading) return;
    setIsLoading(true);
    kickMemberMutate(id);
  };
  const pressDeleteMoimButton = () => {
    if (isLoading) return;
    setIsLoading(true);
    deleteMoimMutate();
  };
  const pressChangeHostButton = (id: number) => {
    if (isLoading) return;
    setIsLoading(true);
    changeHostMutate(id);
  };
  const pressAccetOutModal = () => {
    if (isLoading) return;
    setIsLoading(true);
    setModal(null);
    outMoimMutate();
  };

  return {
    states: {
      inviteRef,
      hostRef,
      kickRef,
      member,
      nameRef,
      moimCode,
      isHost,
      modal,
      isValid,
      moimNameRef,
    },
    actions: {
      openModal,
      closeModal,
      openBottomSheet,
      deleteMoimMutate,
      pressAccetOutModal,
      pressChangeHostButton,
      pressKickMemberButton,
      pressDeleteMoimButton,
      closeNameBottomSheet,
      setIsValid,
      changeMoimNameMutate
    },
  };
};

export default useAction;
