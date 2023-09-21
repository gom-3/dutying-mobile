import { useState } from 'react';
import { images } from '@assets/images/profiles';
import { useSignupStore } from '@pages/SignupPage/store';
import useImagePicker from '@hooks/useImagePicker';
import { useMutation } from '@tanstack/react-query';
import { SignupRequestDTO, changeAccountStatus, editAccount } from '@libs/api/account';
import { useLinkProps } from '@react-navigation/native';
import { useAccountStore } from 'store/account';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import analytics from '@react-native-firebase/analytics';

const useProfile = () => {
  const [id, name, image, photo, setState] = useSignupStore((state) => [
    state.id,
    state.name,
    state.image,
    state.photo,
    state.setState,
  ]);
  const [setAccountState] = useAccountStore((state) => [state.setState]);
  const {
    actions: { pickImage },
  } = useImagePicker();
  const [randomPressed, setRandomPressed] = useState(false);
  const [photoPressed, setPhotoPressed] = useState(false);

  const { onPress: navigateToHome } = useLinkProps({ to: { screen: 'Onboarding' } });

  const { mutate: changeAccountStatusMutate } = useMutation(
    () => changeAccountStatus(id, 'ACTIVE'),
    {
      onSuccess: () => {
        navigateToHome();
      },
    },
  );

  const { mutate: signupMutate } = useMutation(
    ({ accountId, name, profileImgBase64 }: SignupRequestDTO) =>
      editAccount(accountId, name, profileImgBase64),
    {
      onSuccess: (data) => {
        setAccountState('account', data);
        changeAccountStatusMutate();
      },
    },
  );

  const pressSignupButton = async () => {
    analytics().logEvent('signup');
    const profile = photo ? photo : image;
    const base64 = await imageToBase64(profile);
    if (base64) {
      signupMutate({ accountId: id, name: name, profileImgBase64: base64 });
    }
  };

  const imageToBase64 = async (imageUri: string) => {
    const asset = Asset.fromModule(imageUri);
    await asset.downloadAsync();

    if (!asset.localUri) return;
    const base64String = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return base64String;
  };

  const setRandomImage = () => {
    analytics().logEvent('change_image');
    setState('image', images[Math.floor(Math.random() * 30)]);
    setState('photo', null);
  };

  const setPhotoImage = async () => {
    analytics().logEvent('change_photo');
    const photo = await pickImage();
    if (photo) {
      setState('photo', photo);
    }
  };

  return {
    states: { image, photo, randomPressed, photoPressed },
    actions: {
      setRandomImage,
      setPhotoImage,
      setRandomPressed,
      setPhotoPressed,
      pressSignupButton,
    },
  };
};

export default useProfile;
