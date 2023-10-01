import { navigateToLoginAndResetHistory } from '@libs/utils/navigate';
import { screenHeight, screenWidth } from 'index.style';
import { ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAccountStore } from 'store/account';

interface Props {
  children: ReactNode;
  withoutLogin?: boolean;
}

const PageViewContainer = ({ children, withoutLogin }: Props) => {
  const [account] = useAccountStore((state) => [state.account]);

  useEffect(() => {
    if (account.accountId === 0 && !withoutLogin)
      setTimeout(() => navigateToLoginAndResetHistory(), 100);
  }, [account.accountId]);

  return <View style={styles.container}>{children}</View>;
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
