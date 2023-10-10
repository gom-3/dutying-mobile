import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { changeMoimHost, deleteMoim, kickMemberFromMoim, withdrawMoim } from '@libs/api/moim';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useAccountStore } from 'store/account';

type ActionsAccountType = Pick<Account, 'accountId' | 'name'>;

const useAction = (moim: Moim, close: () => void) => {
  const [member, setMember] = useState<ActionsAccountType>({ accountId: 0, name: '' });
  const [accountId] = useAccountStore((state) => [state.account.accountId]);
  const [moimCode] = useMoimStore((state) => [state.moimCode]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [isChangeMasterModalOpen, setIsChangeMasterModalOpen] = useState(false);
  const [isOutModalOpen, setIsOutModalOpen] = useState(false);
  const navigate = useNavigation();
  const queryClient = useQueryClient();

  const inviteRef = useRef<BottomSheetModal>(null);
  const changeRef = useRef<BottomSheetModal>(null);
  const kickRef = useRef<BottomSheetModal>(null);

  const isHost = moim.hostInfo.accountId === accountId;

  const { mutate: deleteMoimMutate } = useMutation(() => deleteMoim(moim.moimId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      navigate.goBack();
    },
  });

  const { mutate: outMoimMutate } = useMutation(() => withdrawMoim(moim.moimId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      navigate.goBack();
    },
  });

  const { mutate: kickMemberMutate } = useMutation(
    (memberId: number) => kickMemberFromMoim(moim.moimId, memberId),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['getMoimCollection', moim.moimId, ])
        queryClient.invalidateQueries(['getMemberList', moim.moimId]);
        setIsKickModalOpen(false);
        kickRef.current?.present();
      },
    },
  );

  const { mutate: changeHostMutate } = useMutation(
    (memberId: number) => changeMoimHost(moim.moimId, memberId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getMemberList', moim.moimId]);
        setIsChangeMasterModalOpen(false);
        changeRef.current?.present();
      },
    },
  );

  const pressAccetOutModal = () => {
    setIsOutModalOpen(false);
    outMoimMutate();
  };

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

  const openOutModal = () => {
    setIsOutModalOpen(true);
    close();
  };

  const closeOutModal = () => {
    setIsOutModalOpen(false);
    close();
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
    inviteRef.current?.close();
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    inviteRef.current?.present();
  };

  const openChangeMasterModal = (member: ActionsAccountType) => {
    setMember(member);
    setIsChangeMasterModalOpen(true);
    changeRef.current?.close();
  };

  const closeChangeMasterModal = () => {
    setIsChangeMasterModalOpen(false);
    changeRef.current?.present();
  };

  const openKickModal = (member: ActionsAccountType) => {
    setMember(member);
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
      member,
      isDeleteModalOpen,
      isKickModalOpen,
      isChangeMasterModalOpen,
      isOutModalOpen,
      moimCode,
      isHost,
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
      openOutModal,
      closeOutModal,
      pressAccetOutModal,
      kickMemberMutate,
      changeHostMutate
    },
  };
};

export default useAction;
