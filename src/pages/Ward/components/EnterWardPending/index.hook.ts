import { eidtAccountStatus, getAccountMeWaiting } from '@libs/api/account';
import { deleteWatingNurses } from '@libs/api/ward';
import { firebaseLogEvent } from '@libs/utils/event';
import { useLinkProps } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAccountStore } from 'store/account';

const useEnterWardPending = () => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);

  const { data: accountWaitingWard } = useQuery(['accountWaitingWard'], getAccountMeWaiting, {
    enabled: account?.status === 'WARD_ENTRY_PENDING',
  });

  const { onPress: navigateToEnterWard } = useLinkProps({ to: { screen: 'EnterWard' } });

  const pressEnterWard = () => {
    firebaseLogEvent('enter_ward_start');
    navigateToEnterWard();
  };

  const cancelWaiting = async (wardId: number, nurseId: number) => {
    await deleteWatingNurses(wardId, nurseId);
    await eidtAccountStatus(account.accountId, 'WARD_SELECT_PENDING');
    setState('account', {
      ...account,
      status: 'WARD_SELECT_PENDING',
    });
  };

  return {
    states: { account, accountWaitingWard },
    actions: { cancelWaiting, pressEnterWard },
  };
};

export default useEnterWardPending;
