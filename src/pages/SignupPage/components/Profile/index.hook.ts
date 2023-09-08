import { useState } from 'react';
import { images } from '@assets/images';
import { useSignupStore } from '@pages/SignupPage/store';
import useImagePicker from '@hooks/useImagePicker';

const useProfile = () => {
  const [image, photo, isPhoto, setState] = useSignupStore((state) => [
    state.image,
    state.photo,
    state.isPhoto,
    state.setState,
  ]);
  const {
    actions: { pickImage },
  } = useImagePicker();
  const [randomPressed, setRandomPressed] = useState(false);
  const [photoPressed, setPhotoPressed] = useState(false);

  const setRandomImage = () => {
    setState('image', images[Math.floor(Math.random() * 30)]);
    setState('isPhoto', false);
  };

  const setPhotoImage = async () => {
    const photo = await pickImage();
    if (photo) {
      setState('photo', photo);
      setState('isPhoto', true);
    }
  };

  return {
    states: { image, photo, isPhoto, randomPressed, photoPressed },
    actions: { setRandomImage, setPhotoImage, setRandomPressed, setPhotoPressed },
  };
};

export default useProfile;
