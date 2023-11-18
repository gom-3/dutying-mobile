import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { View } from 'react-native';
import useWardPage from './index.hook';
import EnterWardPendingPage from './components/EnterWardPending';
import WardCalendarPage from './Calendar';

const WardPage = () => {
  const {
    states: { account },
  } = useWardPage();
  console.log(account);
  return (
    <PageViewContainer>
      {account.status === 'LINKED' ? <WardCalendarPage /> : <EnterWardPendingPage />}
      <NavigationBar page="ward" />
    </PageViewContainer>
  );
};

export default WardPage;
