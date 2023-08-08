import { screenHeight, screenWidth } from 'index.style';
import { Pressable, StyleSheet, View } from 'react-native';

interface Props {
  clickHandler: () => void;
}

const BackDrop = ({ clickHandler }: Props) => {
  return (
    <Pressable style={styles.pressableCotainer} onPress={clickHandler}>
      <View style={styles.backDropView} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableCotainer: { position: 'absolute', backgroundColor: 'black', opacity: 1, zIndex: 4 },
  backDropView: {
    position: 'absolute',
    backgroundColor: 'black',
    opacity: 0.55,
    zIndex: 4,
    width: screenWidth,
    height: screenHeight,
  },
});

export default BackDrop;
