import { getNotifications } from '@libs/api/notification';
import { useQuery } from '@tanstack/react-query';

const useNotificationPage = () => {
  const { data: notifications } = useQuery(['getNotifications'], () => getNotifications());
  const notificationDates = new Map<string, PushNotification[]>();

  if (notifications) {
    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const dateString = `${date.getFullYear()}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
      if (notificationDates.has(dateString)) {
        notificationDates.get(dateString)?.push(notification);
      } else {
        notificationDates.set(dateString, [notification]);
      }
    });
  }
  console.log(notifications);
  console.log(notificationDates);

  return { states: { notificationDates }, actions: {} };
};

export default useNotificationPage;
