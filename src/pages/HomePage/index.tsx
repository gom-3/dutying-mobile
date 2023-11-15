import Calendar from './components/Calendar';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import { useCaledarDateStore } from 'store/calendar';
import SideMenu from './components/SideMenu';
import NavigationBar from '@components/NavigationBar';
import * as NavigationBarAndroid from 'expo-navigation-bar';
import PageViewContainer from '@components/PageView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDeviceCalendar from '@hooks/useDeviceCalendar';
import { useOnboardingStore } from 'store/onboarding';
import { FreeAlertModal } from '@components/AlertModal';
import { View, Text, Image, Platform } from 'react-native';
import { useLinkProps } from '@react-navigation/native';
import { COLOR, screenWidth } from 'index.style';
import { registDutyImage } from '@assets/images/onboarding';
import { useAccountStore } from 'store/account';
import { useEffect } from 'react';

const HomePage = () => {
  const [account] = useAccountStore((state) => [state.account]);
  const [isCardOpen, isSideMenuOpen] = useCaledarDateStore((state) => [
    state.isCardOpen,
    state.isSideMenuOpen,
  ]);
  const [isRegistOnboarding, setState] = useOnboardingStore((state) => [
    state.regist,
    state.setState,
  ]);

  const { onPress: navigateToRegistDuty } = useLinkProps({ to: { screen: 'RegistDuty' } });
  const closeRegistPopup = () => {
    setState('regist', true);
  };
  const acceptRegistPopup = () => {
    setState('regist', true);
    navigateToRegistDuty();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBarAndroid.setVisibilityAsync('hidden');
    }
  }, []);

  useDeviceCalendar();
  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {account.accountId > 0 && !isCardOpen && (
            <FreeAlertModal
              exitButton
              isOpen={!isRegistOnboarding && account.accountId > 0}
              close={closeRegistPopup}
              accept={acceptRegistPopup}
              acceptText="근무 등록 하러 가기"
              context={
                <View style={{ paddingBottom: 40, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                    <Image
                      source={registDutyImage[0]}
                      resizeMode="contain"
                      style={{
                        width: screenWidth * 0.7,
                        height: (screenWidth * 0.7) / 4,
                        marginBottom: 32,
                      }}
                    />
                  </View>
                  <Text style={{ fontFamily: 'Apple500', fontSize: 20, color: COLOR.sub1 }}>
                    간편하게
                  </Text>
                  <Text style={{ fontFamily: 'Apple500', fontSize: 20, color: COLOR.sub1 }}>
                    근무표 등록해보세요!
                  </Text>
                </View>
              }
            />
          )}
          <Header />
          <Calendar />
          <NavigationBar page="home" />
        </SafeAreaView>
        {isSideMenuOpen && <SideMenu />}
        <ScheduleCard isCardOpen={isCardOpen} />
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

export default HomePage;
