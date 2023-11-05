import { useAccountStore } from 'store/account';

const useWardPage = () => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);

  return {
    states: { account },
    actions: {},
  };
};

export default useWardPage;
