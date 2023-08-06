import { StackParams } from '../Router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from './components/Calendar';
import Header from './components/Header';
import { PageViewContainer } from 'index.style';
import ScheduleCard from './components/ScheduleCard';
import { useCaledarDateStore } from 'store/calendar';
import { shallow } from 'zustand/shallow';
import SideMenu from './components/SideMenu';
import SchedulePopup from './components/SchedulePopup';
import DateSelector from './components/DateSelector';
import NavigationBar from '@components/NavigationBar';

export type HomeNavigationProps = NativeStackScreenProps<StackParams, 'Home'>;

const HomePage = ({ navigation }: HomeNavigationProps) => {
  const [isCardOpen, isSideMenuOpen, isPopupOpen, isDateSelectorOpen] = useCaledarDateStore(
    (state) => [
      state.isCardOpen,
      state.isSideMenuOpen,
      state.isPopupOpen,
      state.isDateSelectorOpen,
    ],
    shallow,
  );
  return (
    <PageViewContainer>
      <Header />
      <Calendar />
      <NavigationBar />
      {isDateSelectorOpen && <DateSelector />}
      {isCardOpen && <ScheduleCard />}
      {isSideMenuOpen && <SideMenu />}
      {isPopupOpen && <SchedulePopup />}
    </PageViewContainer>
  );
};

export default HomePage;
