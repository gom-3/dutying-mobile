import PageHeader from "@components/PageHeader";
import PageViewContainer from "@components/PageView";
import { SafeAreaView } from "react-native-safe-area-context";

const SharePage = () => {
  return <PageViewContainer>
    <SafeAreaView>
      <PageHeader title="공유하기"/>
    </SafeAreaView>
  </PageViewContainer>
};

export default SharePage;