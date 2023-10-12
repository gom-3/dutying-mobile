import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const useImagePicker = () => {
  const [image, setImage] = useState<string>();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (result.assets && result.assets[0].fileSize) {
      if (result.assets[0].fileSize > 2 * 1024 * 1024)
        throw new Error('선택한 이미지의 용량이 너무 큽니다');
      setImage(result.assets[0].uri);
      return result.assets[0].uri;
    }
  };

  return { state: { image }, actions: { pickImage } };
};

export default useImagePicker;
