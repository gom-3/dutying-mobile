import { getAccount } from '@libs/api/account';
import { useLinkProps } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAccountStore } from 'store/account';
import { useOnboardingStore } from 'store/onboarding';

const useWardPage = () => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);
  const [isDoneOnboarding] = useOnboardingStore((state) => [state.ward]);
  const { onPress: navigateToWardOnboarding } = useLinkProps({ to: { screen: 'WardOnboarding' } });
  const { data: accountData } = useQuery(['getMyAccount'], () => getAccount());

  useEffect(() => {
    if (accountData) setState('account', accountData);
    if (accountData?.status === 'LINKED' && !isDoneOnboarding) navigateToWardOnboarding();
  }, [accountData, isDoneOnboarding]);

  return {
    states: { account },
    actions: {},
  };
};

export default useWardPage;
