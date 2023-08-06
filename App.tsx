import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Router from './src/pages/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  NavigationBar.setBackgroundColorAsync('white');
  NavigationBar.setButtonStyleAsync("dark");
  NavigationBar.setVisibilityAsync("hidden");

  const [fontsLoaded] = useFonts({
    Apple: require('./src/assets/fonts/AppleSDGothicNeoR.ttf'),
    Poppins: require('./src/assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('./src/assets/fonts/Poppins-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <EventProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Router />
      </GestureHandlerRootView>
    </EventProvider>
  );
}
