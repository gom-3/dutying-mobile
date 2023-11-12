import { useCaledarDateStore } from 'store/calendar';
import { useFriendStore } from '../../store';
import { useRef, useState } from 'react';
import { Friend, deleteFriend } from '@libs/api/friend';
import { useAccountStore } from 'store/account';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const useFriendsList = () => {
  const [setFriendState] = useFriendStore((state) => [state.setState]);
  const [date] = useCaledarDateStore((state) => [state.date]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFriend, setCurrentFriend] = useState<Friend>();
  const [account] = useAccountStore((state) => [state.account]);
  const queryClient = useQueryClient();
  const friendListRef = useRef<BottomSheetModal>(null);

  const year = date.getFullYear();
  const month = date.getMonth();

  const { mutate: deleteFriendMutate } = useMutation((frinedId: number) => deleteFriend(frinedId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getFriendsList']);
      queryClient.refetchQueries(['getFriendsList']);
      queryClient.invalidateQueries(['getFriendTodayShift']);
      queryClient.refetchQueries(['getFriendTodayShift']);
    },
  });

  const pressBackdrop = () => {
    setFriendState('isBottomSheetOpen', false);
    queryClient.invalidateQueries(['getFriendCollection', year, month]);
    queryClient.refetchQueries(['getFriendCollection', year, month]);
  };

  const openDeleteModal = () => {
    friendListRef.current?.close();
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    friendListRef.current?.present();
  };
  const openFriendsListBottomSheet = () => {
    friendListRef.current?.present();
    setFriendState('isBottomSheetOpen', true);
  };
  const acceptDeleteFriend = async () => {
    if (currentFriend) {
      deleteFriendMutate(currentFriend?.accountId);
      closeDeleteModal();
    }
  };
  const pressDeleteButton = (friend: Friend) => {
    setCurrentFriend(friend);
    openDeleteModal();
  };

  return {
    states: { currentFriend, account, isDeleteModalOpen, friendListRef },
    actions: {
      pressBackdrop,
      closeDeleteModal,
      acceptDeleteFriend,
      pressDeleteButton,
      openFriendsListBottomSheet,
    },
  };
};

export default useFriendsList;
