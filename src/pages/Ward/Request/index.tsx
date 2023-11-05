import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import WardHeader from '../components/WardHeader';
import NavigationBar from '@components/NavigationBar';

const RequestWardShiftPage = () => {
  return (
    <PageViewContainer>
      <SafeAreaView>
        <WardHeader tab="request" />
      </SafeAreaView>
      <NavigationBar page='ward'/>
    </PageViewContainer>
  );
};

export default RequestWardShiftPage;
