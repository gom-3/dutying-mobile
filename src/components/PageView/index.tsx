import { useLinkProps } from '@react-navigation/native';
import { screenHeight, screenWidth } from 'index.style';
import { ReactNode, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAccountStore } from 'store/account';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  withoutLogin?: boolean;
}

const PageViewContainer = ({ children, withoutLogin, style }: Props) => {
  const [isLoggedIn] = useAccountStore((state) => [state.isLoggedIn]);
  const { onPress: redirectToLoginPage } = useLinkProps({ to: { screen: 'Login' } });

  useEffect(() => {
    // if (!isLoggedIn && !withoutLogin) setTimeout(() => redirectToLoginPage(), 100);
  }, [isLoggedIn]);

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
