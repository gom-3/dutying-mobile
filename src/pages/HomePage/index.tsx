import Calendar from './components/Calendar';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import { useCaledarDateStore } from 'store/calendar';
import SideMenu from './components/SideMenu';
import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePage = () => {
  const [isCardOpen, isSideMenuOpen] = useCaledarDateStore((state) => [
    state.isCardOpen,
    state.isSideMenuOpen,
  ]);
  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <Header />
          <Calendar />
        </SafeAreaView>
        <NavigationBar page="home" />
        {isSideMenuOpen && <SideMenu />}
        {isCardOpen && <ScheduleCard />}
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

export default HomePage;
