import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNotificationPage, { notificationClass } from './index.hook';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { COLOR, screenWidth } from 'index.style';
import SocialIcon from '@assets/svgs/social-selected.svg';

const Notification = () => {
  const {
    states: { notificationDates },
    actions: { refuseRequestMutate, acceptRequestMutate },
  } = useNotificationPage();
  return (
    <PageViewContainer>
      <SafeAreaView>
        <PageHeader title="알림" />
      </SafeAreaView>
      {Array.from(notificationDates.keys()).map((date) => (
        <View key={date}>
          <Text style={{ fontSize: 14, fontFamily: 'Apple', color: COLOR.sub3, marginLeft: 24 }}>
            {date}
          </Text>
          {notificationDates.get(date)?.map((notification) => (
            <View key={notification.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  marginHorizontal: 24,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {notificationClass.includes(notification.classification) ? (
                  <Image
                    source={{ uri: `data:image/png;base64,${notification.imgBase64}` }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                      backgroundColor: COLOR.main4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SocialIcon scaleX={0.9} scaleY={0.9} />
                  </View>
                )}
                <Text
                  style={{
                    marginLeft: 14,
                    fontSize: 12,
                    fontFamily: 'Apple500',
                    width:
                      notification.classification === 'RECEIVE_FRIEND_REQUEST'
                        ? screenWidth * 0.45
                        : screenWidth,
                    color: COLOR.sub1,
                  }}
                >
                  {notification.content}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => acceptRequestMutate(notification.friendRequestInfo?.senderId || 0)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 5,
                    backgroundColor: COLOR.main1,
                    marginRight: 5,
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'Apple500', fontSize: 14 }}>수락</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => refuseRequestMutate(notification.friendRequestInfo?.senderId || 0)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 5,
                    backgroundColor: COLOR.sub3,
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'Apple500', fontSize: 14 }}>거절</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </PageViewContainer>
  );
};

export default Notification;
