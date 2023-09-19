import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { screenHeight, screenWidth } from 'index.style';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const Term = () => {
  return (
    <PageViewContainer withoutLogin>
      <View style={{ marginTop: 20 }} />
      <PageHeader title="약관" />
      <WebView style={styles.webview} source={{ uri: 'https://webview.dutying.net/terms' }} />
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  webview: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
});

export default Term;
