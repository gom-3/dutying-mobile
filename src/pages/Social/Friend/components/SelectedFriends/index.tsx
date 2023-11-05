import { Friend } from '@libs/api/friend';
import { COLOR } from 'index.style';
import { TouchableOpacity, View, Text } from 'react-native';
import ExitIcon from '@assets/svgs/exit-purple.svg';
import { useCaledarDateStore } from 'store/calendar';
import useFavorite from '@hooks/useFavorite';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  favoriteFriends: Friend[];
}

const SelectedFriends = ({ favoriteFriends }: Props) => {
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
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopColor: COLOR.main4,
        borderBottomColor: COLOR.main4,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 4,
        paddingLeft: 24,
      }}
    >
      {favoriteFriends.map((friend) => (
        <TouchableOpacity
          key={`ff-${friend.accountId}`}
          onPress={() => pressDeleteName(friend.accountId)}
          style={{
            flexDirection: 'row',
            backgroundColor: COLOR.main4,
            borderRadius: 30,
            paddingLeft: 10,
            paddingRight: 4,
            paddingVertical: 4,
            alignItems: 'center',
            marginRight: 8,
          }}
        >
          <Text style={{ fontFamily: 'Apple', fontSize: 14, color: COLOR.sub1, marginRight: 8 }}>
            {friend.name}
          </Text>
          <ExitIcon />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectedFriends;
