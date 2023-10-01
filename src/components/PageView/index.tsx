import { navigateToLoginAndResetHistory } from '@libs/utils/navigate';
import { screenHeight, screenWidth } from 'index.style';
import { ReactNode, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAccountStore } from 'store/account';
import Constants from 'expo-constants';
import { tempAndroidAccount } from '@mocks/account';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  withoutLogin?: boolean;
}


const PageViewContainer = ({ children, withoutLogin, style }: Props) => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);
  const { onPress: redirectToLoginPage } = useLinkProps({ to: { screen: 'Login' } });

  useEffect(() => {
    // expo go 환경일 때는 소셜로그인이 불가능하니 임시 로그인 처리
    if (Constants.appOwnership !== 'expo') {
      if (account.accountId === 0 && !withoutLogin) setTimeout(() => navigateToLoginAndResetHistory(), 100);
    } else {
      setState('account', tempAndroidAccount);
    }
  }, [account.accountId]);

  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
    backgroundColor: 'white',
    zIndex: 5,
  },
});

export default PageViewContainer;
