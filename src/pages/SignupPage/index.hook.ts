import { useNavigation } from '@react-navigation/native';
import { useSignupStore } from './store';
import * as FileSystem from 'expo-file-system';

const useSignupPage = () => {
  const [step, setState] = useSignupStore((state) => [state.step, state.setState]);
  const navigation = useNavigation();

  const onPressBack = () => {
    if (step > 1) setState('step', step - 1);
    else navigation.goBack();
  };

  const imageToBase64 = async (imageUri:string) => {
    const base64 = await FileSystem.readAsStringAsync(imageUri,{
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };

  return { states: { step }, actions: { onPressBack } };
};

export default useSignupPage;
