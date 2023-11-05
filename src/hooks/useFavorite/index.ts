import { deleteFavoriteFriend, registFavoriteFriend } from '@libs/api/friend';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const useFavorite = () => {
  const queryClient = useQueryClient();
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const { mutate: registFavoriteMutate } = useMutation(
    (friendId: number) => registFavoriteFriend(friendId),
    {
      onSuccess: () => {
        setIsCallingAPI(false);
        queryClient.invalidateQueries(['getFriendsList']);
        queryClient.refetchQueries(['getFriendsList']);
      },
    },
  );
  const { mutate: deleteFavoriteMutate } = useMutation(
    (friendId: number) => deleteFavoriteFriend(friendId),
    {
      onSuccess: () => {
        setIsCallingAPI(false);
        queryClient.invalidateQueries(['getFriendsList']);
        queryClient.refetchQueries(['getFriendsList']);
      },
    },
  );
  return {
    states: { isCallingAPI },
    actions: { setIsCallingAPI, registFavoriteMutate, deleteFavoriteMutate },
  };
};

export default useFavorite;
