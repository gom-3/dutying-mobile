import { useNavigation } from '@react-navigation/native';
import { useSignupStore } from './store';

const useSignupPage = () => {
  const [step, setState] = useSignupStore((state) => [state.step, state.setState]);
  const navigation = useNavigation();

  const onPressBack = () => {
    if (step > 1) setState('step', step - 1);
    else navigation.goBack();
  };

  return { states: { step }, actions: { onPressBack } };
};

export default useSignupPage;
