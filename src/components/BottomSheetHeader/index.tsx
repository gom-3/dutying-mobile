import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import ExitIcon from '@assets/svgs/exit.svg';
import { COLOR } from 'index.style';

interface Props {
  onPressExit: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
  rightItems?: JSX.Element;
  titleMargin?: number;
}

const BottomSheetHeader = ({ style, title, onPressExit, rightItems, titleMargin }: Props) => {
  return (
    <View style={[styles.header, style]}>
      <Pressable onPress={onPressExit}>
        <ExitIcon />
      </Pressable>
      <Text style={[styles.title, { marginLeft: titleMargin ? titleMargin : 0 }]}>{title}</Text>
      {rightItems ?? <View style={styles.blank} />}
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
  blank: { width: 24 },
});

export default BottomSheetHeader;
