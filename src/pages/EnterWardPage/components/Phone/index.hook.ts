import { useEnterWardPageStore } from '@pages/EnterWardPage/store';
import { useEffect, useState } from 'react';

const usePhone = () => {
  const [phoneNum, setState] = useEnterWardPageStore((state) => [state.phoneNum, state.setState]);
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState(' ');

  const onChangeTextInput = (text: string) => {
    setState('phoneNum', text);
  };

  const clearTextInput = () => {
    setState('phoneNum', '');
    setIsValid(false);
    setFeedback(' ');
  };

  const toNextStep = () => {
    setState('step', 4);
  };

  useEffect(() => {
    if (phoneNum === '') setFeedback('');
    const check = /^[0-9]{1,11}$/.test(phoneNum);
    if (phoneNum.length === 11 && check) {
      setIsValid(true);
      setFeedback(' ');
    } else {
      setIsValid(false);
      if (phoneNum.length > 0) setFeedback(check ? '' : '공백 및 특수문자는 사용 불가능합니다.');
    }
  }, [phoneNum]);

  return {
    states: { phoneNum, isValid, feedback },
    actions: { onChangeTextInput, clearTextInput, toNextStep },
  };
};

export default usePhone;
