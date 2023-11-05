type PushNotification = {
  id: number;
  receiverId: number;
  content: string;
  url: string;
  classification: string;
  isRead: boolean;
  createdAt: string;
  imgBase64: string;
  friendRequestInfo: {
    isAccepted: boolean;
    isChecked: boolean;
    senderId: number;
  } | null;
};
