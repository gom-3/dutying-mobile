import { COLOR } from 'index.style';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface Props {
  text: string;
  Icon?: React.FC<SvgProps>;
  disabled?: boolean;
  onPress: () => void;
}

const NextButton = ({ text, Icon, disabled, onPress }: Props) => {
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View style={[styles.container, { backgroundColor: disabled ? COLOR.main3 : COLOR.main1 }]}>
        <Text style={styles.text}>{text}</Text>
        {Icon && <Icon />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Apple500',
    fontSize: 16,
  },
});

export default NextButton;
