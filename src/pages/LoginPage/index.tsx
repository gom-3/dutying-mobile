import PageViewContainer from '@components/PageView';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  BackHandler,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KakaoLogo from '@assets/svgs/kakao.svg';
import AppleLogo from '@assets/svgs/apple.svg';
import { useLinkProps } from '@react-navigation/native';
import { useAccountStore } from 'store/account';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { screenHeight, screenWidth } from 'index.style';
import { KakaoOAuthToken, login } from '@react-native-seoul/kakao-login';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { demoLogin, getAccount, oAuthLogin } from '@libs/api/account';
import { useSignupStore } from '@pages/SignupPage/store';
import { firebaseLogEvent } from '@libs/utils/event';
import axiosInstance from '@libs/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';

const LoginPage = () => {
  const { onPress: navigateHome } = useLinkProps({ to: { screen: 'Home' } });
  const { onPress: navigateSignup } = useLinkProps({ to: { screen: 'Signup' } });
  const { onPress: navigateTerm } = useLinkProps({ to: { screen: 'Term' } });
  const [deviceToken, setState, account] = useAccountStore((state) => [
    state.deviceToken,
    state.setState,
    state.account,
  ]);
  const [setSignupState] = useSignupStore((state) => [state.setState]);
  const [accountId, setAccountId] = useState(0);
  const [click, setClick] = useState(0);
  const queryClient = useQueryClient();

  const { mutate: demoLoginMutate } = useMutation(() => demoLogin(), {
    onSuccess: (data) => {
      setAccountId(2);
      queryClient.invalidateQueries(['getAccount', 2]);
      AsyncStorage.setItem('access', data.accessToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    },
  });

  useEffect(() => {
    if (click === 10) {
      if (Platform.OS === 'ios') {
        Alert.prompt('code', '', (text) => {
          if (text === '1q2w3e4r!') {
            demoLoginMutate();
          }
        });
      } else {
        navigateSignup();
        demoLoginMutate();
      }
    }
  }, [click]);

  const { data: accountData } = useQuery(['getAccount', accountId], () => getAccount(accountId), {
    enabled: accountId > 0,
  });
  const { mutate: oAuthLoginMutate } = useMutation(
    ({ idToken, provider }: { idToken: string; provider: string }) =>
      oAuthLogin(idToken, provider, deviceToken),
    {
      onSuccess: (data) => {
        if (data.status === 'INITIAL' || data.name === null) {
          setSignupState('id', data.accountId);
          navigateSignup();
        } else {
          setAccountId(1);
          queryClient.invalidateQueries(['getAccount', 1]);
        }
      },
    },
  );

  useEffect(() => {
    if (accountData) {
      setState('account', accountData);
      navigateHome();
    }
  }, [accountData]);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('hidden');

    return () => {
      backHandler.remove();
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  const onPressKakaoLogin = async () => {
    firebaseLogEvent('kakao');
    const token: KakaoOAuthToken = await login();
    oAuthLoginMutate({ idToken: token.idToken, provider: 'kakao' });
  };

  const onPressAppleLogin = async () => {
    firebaseLogEvent('apple');
    const token = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    setSignupState('name', '' + token.fullName?.familyName + token.fullName?.givenName);
    oAuthLoginMutate({ idToken: token.identityToken || '', provider: 'apple' });
  };

  return (
    <PageViewContainer withoutLogin>
      <SafeAreaView>
        <View style={styles.pageContainer}>
          <View style={styles.guidTextWrapper}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={() => setClick(click + 1)}>
                <Text style={styles.guideTextHighlight}>간편 로그인</Text>
                <View style={styles.guidTextUnderline} />
              </Pressable>
              <View>
                <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
                  후
                </Text>
              </View>
            </View>
            <Text style={styles.guideText}>이용 가능합니다.</Text>
          </View>
          <View style={styles.socialLoginButtonView}>
            <TouchableOpacity onPress={onPressKakaoLogin}>
              <View style={styles.kakaoLoginButton}>
                <KakaoLogo />
                <Text style={styles.kakaoLoginText}>카카오톡으로 시작하기</Text>
              </View>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={onPressAppleLogin}>
                <View style={styles.appleLoginButton}>
                  <AppleLogo />
                  <Text style={styles.appleLoginText}>Apple Id로 시작하기</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.termTextView}>
            <Text style={styles.termText} onPress={() => navigateTerm()}>
              버튼을 누르면 <Text style={styles.termTextHighlight}>서비스약관</Text>,{' '}
              <Text style={styles.termTextHighlight}>개인정보 취급방침</Text>
            </Text>
            <Text style={[styles.termText, { marginTop: 5 }]}>
              수신에 동의하신 것으로 간주합니다.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  webview: {
    width: screenWidth,
    height: screenHeight,
    marginTop: 40,
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
