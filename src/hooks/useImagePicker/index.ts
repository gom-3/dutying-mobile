import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const useImagePicker = () => {
  const [image, setImage] = useState<string>();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return { state: { image }, actions: { pickImage } };
};

export default useImagePicker;
