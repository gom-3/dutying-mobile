import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { View } from 'react-native';
import useWardPage from './index.hook';
import EnterWardPendingPage from './components/EnterWardPending';

const WardPage = () => {
  const {
    states: { account },
  } = useWardPage();

  return (
    <PageViewContainer>
      {account.status === 'LINKED' ? (
        <View>{/* @TODO 병동 페이지 제작 */}</View>
      ) : (
        <EnterWardPendingPage />
      )}
      <NavigationBar page="ward" />
    </PageViewContainer>
  );
};

export default WardPage;
