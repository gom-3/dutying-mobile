import PageViewContainer from '@components/PageView';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KakaoLogo from '@assets/svgs/kakao.svg';
import AppleLogo from '@assets/svgs/apple.svg';
import { useLinkProps } from '@react-navigation/native';
import { useAccountStore } from 'store/account';

const LoginPage = () => {
  const { onPress } = useLinkProps({ to: { screen: 'Home' } });
  const [setState] = useAccountStore((state) => [state.setState]);

  const onPressKakaoLogin = () => {
    setState('isLoggedIn', true);
    onPress();
  };

  return (
    <PageViewContainer>
      <SafeAreaView>
        <View style={styles.pageContainer}>
          <View style={styles.guidTextWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View>
                <Text style={styles.guideTextHighlight}>간편 로그인</Text>
                <View style={styles.guidTextUnderline} />
              </View>
              {/* <Text style={[styles.guideText,{marginTop}]}>후</Text> */}
            </View>
            <Text style={styles.guideText}>이용 가능합니다.</Text>
          </View>
          <View style={styles.socialLoginButtonView}>
            <Pressable onPress={onPressKakaoLogin}>
              <View style={styles.kakaoLoginButton}>
                <KakaoLogo />
                <Text style={styles.kakaoLoginText}>카카오톡으로 시작하기</Text>
              </View>
            </Pressable>
            <Pressable onPress={onPressKakaoLogin}>
              <View style={styles.appleLoginButton}>
                <AppleLogo />
                <Text style={styles.appleLoginText}>Apple Id로 시작하기</Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.termTextView}>
            <Text>
              버튼을 누르면 <Text>서비스약관</Text>, <Text>개인정보 취급방침</Text>
            </Text>
            <Text>수신에 동의하신 것으로 간주합니다.</Text>
          </View>
        </View>
      </SafeAreaView>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  guidTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  guideText: {
    fontFamily: 'Line',
    fontSize: 20,
    color: '#150b3c',
  },
  guideTextHighlight: {
    fontSize: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  guidTextUnderline: {
    height: 1,
    backgroundColor: '#150b3c',
  },
  pageContainer: {
    padding: 32,
    height: '100%',
  },
  socialLoginButtonView: {
    flex: 1,
    justifyContent: 'center',
  },
  kakaoLoginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 75,
    paddingVertical: 13,
    borderRadius: 50,
    backgroundColor: '#fae84c',
  },
  kakaoLoginText: {
    fontSize: 16,
    color: '#150b3c',
    fontFamily: 'Apple500',
    marginLeft: 13,
  },
  appleLoginButton: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 75,
    paddingVertical: 13,
    borderRadius: 50,
    backgroundColor: 'black',
  },
  appleLoginText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Apple500',
    marginLeft: 13,
  },
  termTextView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
});

export default LoginPage;
