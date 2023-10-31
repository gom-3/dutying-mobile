import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const useImagePicker = () => {
  const [image, setImage] = useState<string>();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
    });
    if (result.assets && result.assets[0]) {
      return result.assets[0].base64;
    }
  };

  return { state: { image }, actions: { pickImage } };
};

export default useImagePicker;
