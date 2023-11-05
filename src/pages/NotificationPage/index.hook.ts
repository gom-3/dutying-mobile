import { acceptRequestFriend, refuseRequestFriend } from '@libs/api/friend';
import { getNotifications } from '@libs/api/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const notificationClass = ['RECEIVE_FRIEND_REQUEST', 'ACCEPT_FRIEND_REQUEST', 'SEND_FRIEND_REQUEST'];

const useNotificationPage = () => {
  const { data: notifications } = useQuery(['getNotifications'], () => getNotifications());
  const notificationDates = new Map<string, PushNotification[]>();
  const queryClient = useQueryClient();
  if (notifications) {
    notifications.forEach((notification) => {
      if (notification.friendRequestInfo?.isChecked) return;
      if (!notification.isRead) {
        const date = new Date(notification.createdAt);
        const dateString = `${date.getFullYear()}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        if (notificationDates.has(dateString)) {
          notificationDates.get(dateString)?.push(notification);
        } else {
          notificationDates.set(dateString, [notification]);
        }
      }
    });
  }
  const { mutate: acceptRequestMutate } = useMutation(
    (friendId: number) => acceptRequestFriend(friendId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getNotifications']);
        queryClient.refetchQueries(['getNotifications']);
      },
    },
  );
  const { mutate: refuseRequestMutate } = useMutation(
    (friendId: number) => refuseRequestFriend(friendId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getNotifications']);
        queryClient.refetchQueries(['getNotifications']);
      },
    },
  );

  return { states: { notificationDates }, actions: { acceptRequestMutate, refuseRequestMutate } };
};

export default useNotificationPage;
