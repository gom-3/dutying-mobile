import PageViewContainer from '@components/PageView';
import { View, Text, StyleSheet, Pressable, Platform, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KakaoLogo from '@assets/svgs/kakao.svg';
import AppleLogo from '@assets/svgs/apple.svg';
import { useLinkProps } from '@react-navigation/native';
import { useAccountStore } from 'store/account';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { screenHeight, screenWidth } from 'index.style';
import { KakaoOAuthToken, KakaoProfile, login, getProfile } from '@react-native-seoul/kakao-login';

const LoginPage = () => {
  const { onPress } = useLinkProps({ to: { screen: 'Home' } });
  const [setState] = useAccountStore((state) => [state.setState]);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return backHandler.remove();
  }, []);

  const onPressKakaoLogin = async () => {
    // setState('isLoggedIn', true);
    // onPress();
    // setLoginUrl(
    //   'https://api.dutying.net/oauth2/authorization/kakao?redirectUrl=http://localhost:3000/',
    // );
    const token: KakaoOAuthToken = await login();
    const profile: KakaoProfile = await getProfile();
    console.log(token);
    console.log(profile);
    setState('isLoggedIn', true);
    onPress();
  };

  const onPressAppleLogin = async () => {
    const token = await AppleAuthentication.signInAsync();
    console.log(token);
    // setState('isLoggedIn', true);
    // onPress();
  };

  const handleWebViewNavigationStateChange = (newNavigationState: any) => {
    const { url } = newNavigationState;
    // setLoginUrl(null);
  };

  // const onPressAppleLogin = async () => {
  //   const credential = await AppleAuthentication.signInAsync({
  //     requestedScopes: [
  //       AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //       AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //     ],
  //   });
  // };

  return (
    <PageViewContainer>
      {loginUrl && (
        <WebView
          style={styles.webview}
          source={{ uri: loginUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          javaScriptEnabled={true}
        />
      )}
      <SafeAreaView>
        {!loginUrl && (
          <View style={styles.pageContainer}>
            <View style={styles.guidTextWrapper}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Text style={styles.guideTextHighlight}>간편 로그인</Text>
                  <View style={styles.guidTextUnderline} />
                </View>
                <View>
                  <Text
                    style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}
                  >
                    후
                  </Text>
                </View>
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
              {Platform.OS === 'ios' && (
                <Pressable onPress={onPressAppleLogin}>
                  <View style={styles.appleLoginButton}>
                    <AppleLogo />
                    <Text style={styles.appleLoginText}>Apple Id로 시작하기</Text>
                  </View>
                </Pressable>
              )}
            </View>
            <View style={styles.termTextView}>
              <Text style={styles.termText}>
                버튼을 누르면 <Text style={styles.termTextHighlight}>서비스약관</Text>,{' '}
                <Text style={styles.termTextHighlight}>개인정보 취급방침</Text>
              </Text>
              <Text style={[styles.termText, { marginTop: 5 }]}>
                수신에 동의하신 것으로 간주합니다.
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  webview: {
    width: screenWidth,
    height: screenHeight * 0.8,
    marginTop: 20,
  },
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
    width: '100%',
    alignItems: 'center',
  },
  termText: {
    color: '#ababb4',
    fontSize: 12,
    fontFamily: 'Apple',
  },
  termTextHighlight: {
    textDecorationLine: 'underline',
    fontFamily: 'Apple500',
  },
});

export default LoginPage;
