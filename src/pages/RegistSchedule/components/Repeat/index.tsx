import { COLOR } from 'index.style';
import { View, Text, StyleSheet, Switch, Pressable, Platform } from 'react-native';
import RepeatIcon from '@assets/svgs/repeat.svg';
import useRepeat from './index.hook';

interface Props {
  openModal: () => void;
}

const Repeat = ({ openModal }: Props) => {
  const {
    states: { isRecurrenceUsing, recurrenceRuleText },
    actions: { setIsRecurrenceUsing },
  } = useRepeat(openModal);

  return (
    <View
      style={{
        justifyContent: 'center',
        borderBottomColor: COLOR.sub4,
        borderBottomWidth: 0.3,
        paddingVertical: Platform.OS === 'ios' ? 9 : 14,
      }}
    >
      <View style={styles.item}>
        <View style={styles.itemTitleWrapper}>
          <RepeatIcon />
          <Text style={styles.itemTitle}>반복</Text>
        </View>
        <Switch
          trackColor={{ true: COLOR.main1 }}
          thumbColor="white"
          value={isRecurrenceUsing}
          onValueChange={setIsRecurrenceUsing}
        />
      </View>
      {isRecurrenceUsing && (
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
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple500', fontSize: 16, color: COLOR.sub2 },
  usingView: {
    marginHorizontal: 24,
    marginTop: Platform.OS === 'ios' ? 18 : 24,
    marginBottom: Platform.OS === 'ios' ? 33 : 28,
  },
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
