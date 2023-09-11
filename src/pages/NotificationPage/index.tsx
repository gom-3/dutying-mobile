import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notification = () => {
  return (
    <PageViewContainer>
      <SafeAreaView>
        <PageHeader title="알림" />
      </SafeAreaView>
    </PageViewContainer>
  );
};

export default Notification;
