import { addMeToWatingNurses, getWardByCode } from '@libs/api/ward';
import { useEnterWardPageStore } from '@pages/EnterWardPage/store';
import { useLinkProps } from '@react-navigation/native';
import { useState } from 'react';
import { createAccountNurse } from '@libs/api/nurse';
import { useAccountStore } from 'store/account';
import { eidtAccountStatus } from '@libs/api/account';

const useEnterWard = () => {
  const [name, phoneNum, gender, isWorker, setState] = useEnterWardPageStore((state) => [
    state.name,
    state.phoneNum,
    state.gender,
    state.isWorker,
    state.setState,
  ]);
  const [account, setAccountState] = useAccountStore((state) => [state.account, state.setState]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ward, setWard] = useState<Ward | null>(null);
  const [error, setError] = useState<boolean>(false);

  const { onPress: navigateToWard } = useLinkProps({ to: { screen: 'Ward' } });

  const enterWard = async (wardId: number) => {
    setState('isLoading', true);

    let nurseId = account.nurseId;
    /**게정 간호사 등록 */
    if (!account.nurseId) {
      const nurse = await createAccountNurse(account.accountId, {
        name,
        phoneNum,
        gender: gender!,
        isWorker,
      });
      nurseId = nurse.nurseId;
    }
    /**병동 입장 */
    await addMeToWatingNurses(wardId);
    await eidtAccountStatus(account.accountId, 'WARD_ENTRY_PENDING');
    setAccountState('account', {
      ...account,
      nurseId,
      status: 'WARD_ENTRY_PENDING',
    });
    setState('isLoading', false);
    setOpenModal(true);
  };

  const handleGetWard = async (code: string) => {
    try {
      const ward = await getWardByCode(code);
      setWard(ward);
      setError(false);
    } catch (error) {
      setError(true);
      setWard(null);
    }
  };

  return {
    states: { ward, error, openModal },
    actions: {
      setError,
      enterWard,
      navigateToWard,
      handleGetWard,
    },
  };
};

export default useEnterWard;
