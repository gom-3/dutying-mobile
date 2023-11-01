import { addMeToWatingNurses, getWardByCode } from '@libs/api/ward';
import { useEnterWardStore } from '@pages/EnterWardPage/store';
import { useLinkProps } from '@react-navigation/native';
import { createRef, useEffect, useRef, useState } from 'react';
import { createAccountNurse } from '@libs/api/nurse';
import { useAccountStore } from 'store/account';
import { TextInputKeyPressEventData } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import { eidtAccountStatus } from '@libs/api/account';

const useCode = () => {
  const [name, phoneNum, gender, isWorker, setState] = useEnterWardStore((state) => [
    state.name,
    state.phoneNum,
    state.gender,
    state.isWorker,
    state.setState,
  ]);
  const [account, setAccountState] = useAccountStore((state) => [state.account, state.setState]);
  const [codeList, setCodeList] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const codeRefList = useRef(Array.from({ length: 6 }).map(() => createRef<TextInput>()));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [ward, setWard] = useState<Ward | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { onPress: navigateToWard } = useLinkProps({ to: { screen: 'Ward' } });

  const handleKeyDown = (e: TextInputKeyPressEventData['key']) => {
    console.log(e);
    if (e === 'Backspace') {
      setCodeList(codeList.map((code, index) => (index === focusedIndex ? null : code)));
      setFocusedIndex(Math.max(0, focusedIndex - 1));
      codeRefList.current[Math.max(0, focusedIndex - 1)].current?.focus();
    } else if (/[0-9a-zA-Z]/.test(e)) {
      setCodeList(codeList.map((code, index) => (index === focusedIndex ? e.toUpperCase() : code)));
      setFocusedIndex(Math.min(5, focusedIndex + 1));
      codeRefList.current[Math.min(5, focusedIndex + 1)].current?.focus();
    }
  };

  const handlePasteCode = async () => {
    const copiedContent = await Clipboard.getString();
    console.log(copiedContent);
    if (!/[0-9a-zA-Z]/.test(copiedContent)) {
      setError('올바르지 않은 코드입니다.');
      return;
    }
    setCodeList(
      copiedContent
        .slice(0, 6)
        .split('')
        .map((x) => x.toUpperCase()),
    );
  };

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
    setOpen(true);
  };

  const handleGetWard = async (code: string) => {
    try {
      const ward = await getWardByCode(code);
      setWard(ward);
      setError(null);
    } catch (error) {
      setError('올바르지 않은 코드입니다.');
      setWard(null);
    }
  };

  useEffect(() => {
    if (codeList.every((code) => code !== null)) {
      const code = codeList.join('');
      handleGetWard(code);
    } else {
      setError(null);
      setWard(null);
    }
  }, [codeList]);

  return {
    states: { focusedIndex, codeList, codeRefList, open, ward, error },
    actions: {
      setFocusedIndex,
      enterWard,
      navigateToWard,
      handleKeyDown,
      handlePasteCode,
    },
  };
};

export default useCode;
