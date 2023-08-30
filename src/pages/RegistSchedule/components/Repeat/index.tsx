import { COLOR } from 'index.style';
import { View, Text, StyleSheet, Switch, Pressable, Platform } from 'react-native';
import RepeatIcon from '@assets/svgs/repeat.svg';
import useRepeat from './index.hook';

interface Props {
  openModal: () => void;
}

const Repeat = ({ openModal }: Props) => {
  const {
    states: { using, recurrenceRuleText },
    actions: { setUsing },
  } = useRepeat(openModal);

  return (
    <View>
      <View style={styles.item}>
        <View style={styles.itemTitleWrapper}>
          <RepeatIcon />
          <Text style={styles.itemTitle}>반복</Text>
        </View>
        <Switch
          trackColor={{ true: COLOR.main1 }}
          thumbColor="white"
          value={using}
          onValueChange={(value) => setUsing(value)}
        />
      </View>
      {using && (
        <View style={styles.usingView}>
          <Pressable onPress={openModal}>
            <View style={styles.usingItemWrapper}>
              <Text style={styles.usingItemText}>{recurrenceRuleText}</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
  usingView: { marginHorizontal: 24, marginVertical: 0 },
  usingItemWrapper: { flexDirection: 'row' },
  usingItemText: {
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    color: COLOR.sub1,
    paddingVertical: 4,
  },
});

export default Repeat;
