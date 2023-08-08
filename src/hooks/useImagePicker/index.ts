import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';

const useImagePicker = () => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
  };
  useEffect(()=>{
    pickImage();
  },[]);
};

export default useImagePicker;