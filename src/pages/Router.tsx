import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import HomePage from './HomePage';
import MoimPage from './Social/Moim';
import RegistDuty from './RegistDuty';
import RegistSchedulePage from './RegistSchedule';
import ShiftTypePage from './ShiftTypePage';
import ShiftTypeEditPage from './ShiftTypePage/ShiftTypeEditPage';
import SharePage from './SharePage';
import useShiftType from '@hooks/useShiftType';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import Notification from './NotificationPage';
import OnboardingPage from './OnboardingPage';
import DeviceCalendarPage from './DeviceCalendarPage';
import MoimDetailPage from './Social/Moim/MoimDetailPage';
import Term from './LoginPage/Term';
import { Stack, StackParams, navigationRef } from '@libs/utils/navigate';
import * as Linking from 'expo-linking';
import MoimEnterPage from './Social/Moim/MoimEnterPage';
import WardPage from './Ward';
import MyPage from './MyPage';

// Airbridge.deeplink.setDeeplinkListener((deeplink) => {
//   // code that will run when app is opened with deep-link or deferred-deep-link
//   // deeplink = YOUR_SCHEME://...
//   console.log(deeplink);
// });

const prefix = Linking.createURL('/');

const Router = () => {
  const linking: LinkingOptions<StackParams> = {
    prefixes: [prefix],
    config: {
      screens: {
        Login: 'login',
        Moim: 'moim',
      },
    },
  };

  useShiftType();

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Term" component={Term} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Home" component={HomePage} options={{ gestureEnabled: false }} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen
          name="Moim"
          component={MoimPage}
          options={{ animation: 'none', gestureEnabled: false }}
        />
        <Stack.Screen name="MoimEnter" component={MoimEnterPage} />
        <Stack.Screen name="MoimDetail" component={MoimDetailPage} />
        <Stack.Screen name="RegistDuty" component={RegistDuty} />
        <Stack.Screen name="RegistSchedule" component={RegistSchedulePage} />
        <Stack.Screen name="ShiftType" component={ShiftTypePage} />
        <Stack.Screen name="ShiftTypeEdit" component={ShiftTypeEditPage} />
        <Stack.Screen name="Share" component={SharePage} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingPage}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="DeviceCalendar" component={DeviceCalendarPage} />
        <Stack.Screen
          name="Ward"
          component={WardPage}
          options={{ animation: 'none', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
