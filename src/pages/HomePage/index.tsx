import Calendar from './components/Calendar';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import { useCaledarDateStore } from 'store/calendar';
import SideMenu from './components/SideMenu';
import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDeviceCalendar from '@hooks/useDeviceCalendar';

const HomePage = () => {
  const [isCardOpen, isSideMenuOpen] = useCaledarDateStore((state) => [
    state.isCardOpen,
    state.isSideMenuOpen,
  ]);
  useDeviceCalendar();
  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView style={{ flex: 1 }}>
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
