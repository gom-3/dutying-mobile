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
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAccount, oAuthLogin } from '@libs/api/account';
import { useSignupStore } from '@pages/SignupPage/store';
import { firebaseLogEvent } from '@libs/utils/event';

const LoginPage = () => {
  const { onPress: navigateHome } = useLinkProps({ to: { screen: 'Home' } });
  const { onPress: navigateSignup } = useLinkProps({ to: { screen: 'Signup' } });
  const { onPress: navigateTerm } = useLinkProps({ to: { screen: 'Term' } });
  const [setState] = useAccountStore((state) => [state.setState]);
  const [setSignupState] = useSignupStore((state) => [state.setState]);
  const [accountId, setAccountId] = useState(0);
  const [click, setClick] = useState(0);

  useEffect(() => {
    if (click === 10) {
      if (Platform.OS === 'ios') {
        Alert.prompt('code', '', (text) => {
          if (text === '1q2w3e4r!') {
            setState('account', {
              accountId: 28,
              nurseId: 0,
              wardId: 0,
              shiftTeamId: 0,
              email: 'cksr1@hanmail.net',
              name: '김찬규',
              isManager: false,
              profileImgBase64:
                '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',
              status: 'INITIAL',
            });
            navigateHome();
          }
        });
      } else {
        setState('account', {
          accountId: 28,
          nurseId: 0,
          wardId: 0,
          shiftTeamId: 0,
          email: 'cksr1@hanmail.net',
          name: '김찬규',
          isManager: false,
          profileImgBase64:
            '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',
          status: 'INITIAL',
        });
        navigateHome();
      }
    }
  }, [click]);

  const { data: accountData } = useQuery(['getAccount', accountId], () => getAccount(accountId), {
    enabled: accountId > 0,
  });

  const { mutate: oAuthLoginMutate } = useMutation(
    ({ idToken, provider }: { idToken: string; provider: string }) => oAuthLogin(idToken, provider),
    {
      onSuccess: (data) => {
        if (data.status === 'INITIAL' || data.name === null) {
          setSignupState('id', data.accountId);
          navigateSignup();
        } else {
          setAccountId(data.accountId);
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

    return backHandler.remove();
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
