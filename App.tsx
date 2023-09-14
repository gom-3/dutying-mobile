import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Router from './src/pages/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import * as NavigationBar from 'expo-navigation-bar';
import { AppStateStatus, Platform } from 'react-native';
import { QueryClient, QueryClientProvider, focusManager, useQuery } from '@tanstack/react-query';
import { useAppState } from './src/hooks/useAppState';
import * as SplashScreen from 'expo-splash-screen';
import useDeviceCalendar from './src/hooks/useDeviceCalendar';
SplashScreen.preventAutoHideAsync();

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function App() {
  useDeviceCalendar();
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('white');
      NavigationBar.setButtonStyleAsync('dark');
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  useAppState(onAppStateChange);

  const [fontsLoaded] = useFonts({
    Apple: require('./src/assets/fonts/AppleSDGothicNeoR.ttf'),
    Apple500: require('./src/assets/fonts/AppleSDGothicNeoM.ttf'),
    Apple600: require('./src/assets/fonts/AppleSDGothicNeoB.ttf'),
    Poppins: require('./src/assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('./src/assets/fonts/Poppins-Medium.ttf'),
    Poppins600: require('./src/assets/fonts/Poppins-Bold.ttf'),
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
