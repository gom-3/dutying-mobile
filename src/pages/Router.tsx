import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

export type StackParams = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Moim: undefined;
  MoimDetail: undefined;
  RegistDuty: undefined;
  RegistSchedule: undefined;
  ShiftType: undefined;
  ShiftTypeEdit: undefined;
  Share: undefined;
  Notification: undefined;
  Onboarding: undefined;
  DeviceCalendar: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

const Router = () => {
  useShiftType();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Home" component={HomePage} options={{ gestureEnabled: false }} />
        <Stack.Screen
          name="Moim"
          component={MoimPage}
          options={{ animation: 'none', gestureEnabled: false }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
