import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNotificationPage from './index.hook';
import { Text, View } from 'react-native';
import { COLOR } from 'index.style';
import SocialIcon from '@assets/svgs/social-selected.svg';

const Notification = () => {
  const {
    states: { notificationDates },
    actions: {},
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
            <View
              style={{
                marginHorizontal: 24,
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                width: '80%',
              }}
            >
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
                <SocialIcon scaleX={0.9} scaleY={0.9}/>
              </View>
              <Text
                style={{ marginLeft: 14, fontSize: 12, fontFamily: 'Apple500', color: COLOR.sub1 }}
              >
                {notification.content}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </PageViewContainer>
  );
};

export default Notification;
