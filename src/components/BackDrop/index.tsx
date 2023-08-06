import { screenHeight, screenWidth } from 'index.style';
import { Pressable, View } from 'react-native';

interface Props {
  clickHandler: () => void;
}

const BackDrop = ({ clickHandler }: Props) => {
  return (
    <Pressable
      style={{ position: 'absolute', backgroundColor: 'black', opacity: 1, zIndex: 4 }}
      onPress={clickHandler}
    >
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          opacity: 0.55,
          zIndex: 4,
          width: screenWidth,
          height: screenHeight,
        }}
      />
    </Pressable>
  );
};

export default BackDrop;
