import { useNavigation } from '@react-navigation/native';
import { useEnterWardStore } from './store';

const useSignupPage = () => {
  const [step, isLoading, setState] = useEnterWardStore((state) => [
    state.step,
    state.isLoading,
    state.setState,
  ]);
  const navigation = useNavigation();

  const onPressBack = () => {
    if (step > 1) setState('step', step - 1);
    else navigation.goBack();
  };

  return { states: { step, isLoading }, actions: { onPressBack } };
};

export default useSignupPage;
