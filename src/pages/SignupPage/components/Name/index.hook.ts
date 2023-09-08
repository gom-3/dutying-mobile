import { useSignupStore } from '@pages/SignupPage/store';
import { useEffect, useState } from 'react';

const useName = () => {
  const [name, setState] = useSignupStore((state) => [state.name, state.setState]);
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState(' ');

  const onChangeTextInput = (text: string) => {
    setState('name', text);
  };

  const clearTextInput = () => {
    setState('name', '');
    setIsValid(false);
    setFeedback(' ');
  };

  const toNextStep = () => {
    setState('step', 2);
  };

  useEffect(() => {
    const pattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{1,10}$/;
    if (pattern.test(name)) {
      setIsValid(true);
      setFeedback(' ');
    } else {
      setIsValid(false);
      if (name.length > 0) setFeedback('공백 및 특수문자는 사용 불가능합니다.');
    }
  }, [name]);

  return {
    states: { name, isValid, feedback },
    actions: { onChangeTextInput, clearTextInput, toNextStep },
  };
};

export default useName;
