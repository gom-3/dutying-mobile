import { getAccount } from '@libs/api/account';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAccountStore } from 'store/account';

const useWardPage = () => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);

  // const { data: accountData } = useQuery(['getMyAccount'], () => getAccount());

  // useEffect(() => {
  //   if (accountData) setState('account', accountData);
  // }, [accountData]);

  return {
    states: { account },
    actions: {},
  };
};

export default useWardPage;
