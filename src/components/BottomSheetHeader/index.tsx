import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ExitIcon from '@assets/svgs/exit.svg';
import CheckIcon from '@assets/svgs/check.svg';
import { COLOR } from 'index.style';

interface Props {
  onPressExit: () => void;
  onPressCheck: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

const BottomSheetHeader = ({ style, title, onPressExit, onPressCheck }: Props) => {
  return (
    <View style={[styles.header, style]}>
      <ExitIcon onPress={onPressExit} />
      <Text style={styles.title}>{title}</Text>
      <CheckIcon onPress={onPressCheck} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Apple',
    fontSize: 16,
    color: COLOR.sub2,
  },
});

export default BottomSheetHeader;
