import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type StackParams = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Group: undefined;
  RegistDuty: undefined;
  RegistSchedule: undefined;
  ShiftType: undefined;
  ShiftTypeEdit: undefined;
  Share: undefined;
  Notification: undefined;
  Onboarding: undefined;
  DeviceCalendar: undefined;
  Term: undefined;
  Moim: undefined;
  MoimDetail: undefined;
};

export const Stack = createNativeStackNavigator<StackParams>();

export const navigationRef = createNavigationContainerRef<StackParams>();

export const navigate = (name: keyof StackParams, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};
export const navigateToLoginAndResetHistory = () => {
  navigationRef.current?.reset({ index: 0, routes: [{ name: 'Login' }] });
};
