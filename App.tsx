import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Router from './src/pages/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import * as NavigationBar from 'expo-navigation-bar';
import { Alert, AppStateStatus, Platform } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useAppState } from './src/hooks/useAppState';
import * as SplashScreen from 'expo-splash-screen';
import axiosInstance from './src/libs/api/client';
import { useAccountStore } from './src/store/account';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Messaging from '@react-native-firebase/messaging';

import * as Sentry from '@sentry/react-native';
// import Airbridge from 'airbridge-react-native-sdk';
// import analytics from '@react-native-firebase/analytics';

// const appInstanceId = await analytics().getAppInstanceId();
// if (appInstanceId) {
//   Airbridge.state.setDeviceAlias('ga4_app_instance_id', appInstanceId);
//   Airbridge.state.startTracking();
// }

Sentry.init({
  dsn: 'https://93ddd999daaaa867ad39989278a40c0b@o4505477969084416.ingest.sentry.io/4506099006898176',
  tracesSampleRate: 1.0,
});


const registerForPushNotificationAsync = async () => {
  if (Device.isDevice) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowAlert: true,
      }),
    });
    let token: string;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#ff231f7c',
      });
    }
    // 가지고 있는 권한 가져오기
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // 권한 없으면 요청해서 가져오기
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('알림 권한을 가져오는데 실패했습니다.');
    }

    if (Messaging().isDeviceRegisteredForRemoteMessages) {
      await Messaging().registerDeviceForRemoteMessages();
    }

    token = await Messaging().getToken();
    useAccountStore.getState().setState('deviceToken', token);
  }
};

SplashScreen.preventAutoHideAsync();

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
};

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function App() {
  const [account] = useAccountStore((state) => [state.account]);

  useEffect(() => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${
      useAccountStore.getState().accessToken
    }`;
  }, [account.accountId]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('white');
      NavigationBar.setButtonStyleAsync('dark');
    }
    registerForPushNotificationAsync();
  }, []);

  useAppState(onAppStateChange);

  const [fontsLoaded] = useFonts({
    Apple: require('./src/assets/fonts/AppleSDGothicNeoR.ttf'),
    Apple500: require('./src/assets/fonts/AppleSDGothicNeoM.ttf'),
    Apple600: require('./src/assets/fonts/AppleSDGothicNeoB.ttf'),
    Poppins: require('./src/assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('./src/assets/fonts/Poppins-Medium.ttf'),
    Poppins600: require('./src/assets/fonts/Poppins-Bold.ttf'),
    Line300: require('./src/assets/fonts/LINESeedKR-Th.ttf'),
    Line: require('./src/assets/fonts/LINESeedKR-Rg.ttf'),
    Line500: require('./src/assets/fonts/LINESeedKR-Bd.ttf'),
  });

  const prepare = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EventProvider style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Router />
        </GestureHandlerRootView>
      </EventProvider>
    </QueryClientProvider>
  );
}
