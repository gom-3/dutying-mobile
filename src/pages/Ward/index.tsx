import NavigationBar from '@components/NavigationBar';
import NextButton from '@components/NextButton';
import PageViewContainer from '@components/PageView';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoubleArrowIcon from '@assets/svgs/double-right-arrow.svg';
import LogoIcon from '@assets/svgs/logo-selected.svg';
import { COLOR } from 'index.style';
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
