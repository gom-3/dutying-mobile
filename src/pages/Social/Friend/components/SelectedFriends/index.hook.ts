import useFavorite from '@hooks/useFavorite';
import { useQueryClient } from '@tanstack/react-query';
import { useCaledarDateStore } from 'store/calendar';

const useSelectedFriends = () => {
  const {
    actions: { deleteFavoriteMutate },
  } = useFavorite();
  const [date] = useCaledarDateStore((state) => [state.date]);
  const queryClient = useQueryClient();
  const year = date.getFullYear();
  const month = date.getMonth();

  const pressDeleteName = async (friendId: number) => {
    deleteFavoriteMutate(friendId);
    setTimeout(() => {
      queryClient.invalidateQueries(['getFriendCollection', year, month]);
      queryClient.refetchQueries(['getFriendCollection', year, month]);
    }, 500);
  };

  return { actions: { pressDeleteName } };
};

export default useSelectedFriends;
