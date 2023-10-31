import { useState } from 'react';
import { images } from '@assets/images/profiles';
import { useSignupStore } from '@pages/SignupPage/store';
import useImagePicker from '@hooks/useImagePicker';
import { useMutation } from '@tanstack/react-query';
import { SignupRequestDTO, initAccount } from '@libs/api/account';
import { useLinkProps } from '@react-navigation/native';
import { useAccountStore } from 'store/account';
import { firebaseLogEvent } from '@libs/utils/event';
import { Alert } from 'react-native';

const useProfile = () => {
  const [id, name, image, photo, isLoading, setState] = useSignupStore((state) => [
    state.id,
    state.name,
    state.image,
    state.photo,
    state.isLoading,
    state.setState,
  ]);
  const [setAccountState] = useAccountStore((state) => [state.setState]);
  const {
    actions: { pickImage },
  } = useImagePicker();
  const [randomPressed, setRandomPressed] = useState(false);
  const [photoPressed, setPhotoPressed] = useState(false);

  const { onPress: navigateToHome } = useLinkProps({ to: { screen: 'Onboarding' } });

  const { mutate: signupMutate } = useMutation(
    ({ accountId, name, profileImgBase64 }: SignupRequestDTO) =>
    initAccount(accountId, name, profileImgBase64),
    {
      onSuccess: (data) => {
        setAccountState('account', data);
        setState('isLoading', false);
        navigateToHome();
      },
      onError: () => {
        setState('isLoading', false);
      },
    },
  );

  const pressSignupButton = async () => {
    setState('isLoading', true);
    firebaseLogEvent('signup');
    const profile = photo ? photo : image;
    if (profile) {
      signupMutate({ accountId: id, name: name, profileImgBase64: profile });
    }
  };

  const setRandomImage = () => {
    firebaseLogEvent('change_image');
    setState('image', images[Math.floor(Math.random() * 30)]);
    setState('photo', null);
  };

  const setPhotoImage = async () => {
    firebaseLogEvent('change_photo');
    try {
      const photo = await pickImage();
      if (photo) {
        setState('photo', photo);
      }
    } catch {
      Alert.alert('에러', '선택한 이미지의 용량이 너무 큽니다.');
    }
  };

  return {
    states: { image, photo, randomPressed, photoPressed, isLoading },
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
