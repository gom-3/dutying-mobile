import { useEnterWardPageStore } from '@pages/EnterWardPage/store';

const useGender = () => {
  const [gender, setState] = useEnterWardPageStore((state) => [state.gender, state.setState]);

  const onChangeGender = (gender: '남' | '여') => {
    setState('gender', gender);
  };

  const toNextStep = () => {
    setState('step', 3);
  };

  return {
    states: { gender },
    actions: { onChangeTextInput: onChangeGender, toNextStep },
  };
};

export default useGender;
