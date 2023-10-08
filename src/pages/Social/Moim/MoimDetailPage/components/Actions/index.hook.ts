import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { deleteMoim } from '@libs/api/moim';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useAccountStore } from 'store/account';

const useAction = (moim: Moim, close: () => void) => {
  const [name, setName] = useState('');
  const [accountId] = useAccountStore((state) => [state.account.accountId]);
  const [moimCode] = useMoimStore((state) => [state.moimCode]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [isChangeMasterModalOpen, setIsChangeMasterModalOpen] = useState(false);
  const navigate = useNavigation();
  const queryClient = useQueryClient();

  const { mutate: deleteMoimMutate } = useMutation(() => deleteMoim(moim.moimId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      navigate.goBack();
    },
  });

  const openBottomSheet = (sheet: 'invite' | 'change' | 'kick') => {
    if (sheet === 'invite') inviteRef.current?.present();
    if (sheet === 'change') changeRef.current?.present();
    if (sheet === 'kick') kickRef.current?.present();
    close();
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    close();
  };

  const inviteRef = useRef<BottomSheetModal>(null);
  const changeRef = useRef<BottomSheetModal>(null);
  const kickRef = useRef<BottomSheetModal>(null);

  

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
    inviteRef.current?.close();
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    inviteRef.current?.present();
  };

  const openChangeMasterModal = (name: string) => {
    setName(name);
    setIsChangeMasterModalOpen(true);
    changeRef.current?.close();
  };

  const closeChangeMasterModal = () => {
    setIsChangeMasterModalOpen(false);
    changeRef.current?.present();
  };

  const openKickModal = (name: string) => {
    setName(name);
    setIsKickModalOpen(true);
    kickRef.current?.close();
  };

  const closeKickModal = () => {
    setIsKickModalOpen(false);
    kickRef.current?.present();
  };
  return {
    states: {
      isInviteModalOpen,
      inviteRef,
      changeRef,
      kickRef,
      name,
      isDeleteModalOpen,
      isKickModalOpen,
      isChangeMasterModalOpen,
      moimCode,
    },
    actions: {
      openInviteModal,
      closeInviteModal,
      openChangeMasterModal,
      openDeleteModal,
      openBottomSheet,
      deleteMoimMutate,
      closeKickModal,
      openKickModal,
      closeChangeMasterModal,
      setIsDeleteModalOpen,
    },
  };
};

export default useAction;
