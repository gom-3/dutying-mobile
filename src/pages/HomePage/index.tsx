import { StackParams } from '../Router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from './components/Calendar';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import { useCaledarDateStore } from 'store/calendar';
import SideMenu from './components/SideMenu';
import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

export type HomeNavigationProps = NativeStackScreenProps<StackParams, 'Home'>;

const HomePage = ({ navigation }: HomeNavigationProps) => {
  const [isCardOpen, isSideMenuOpen, isPopupOpen, isDateSelectorOpen] = useCaledarDateStore(
    (state) => [
      state.isCardOpen,
      state.isSideMenuOpen,
      state.isPopupOpen,
      state.isDateSelectorOpen,
    ],
  );
  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <Header />
          <Calendar />
        </SafeAreaView>
        <NavigationBar />
        {isCardOpen && <ScheduleCard />}
        {isSideMenuOpen && <SideMenu />}
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

export default HomePage;
