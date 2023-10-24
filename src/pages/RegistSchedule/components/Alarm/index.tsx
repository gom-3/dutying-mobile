import { COLOR } from 'index.style';
import { View, Text, StyleSheet, Switch, Pressable, Platform } from 'react-native';
import AlarmClockIcon from '@assets/svgs/clock-alarm.svg';
import useAlarm from './index.hook';

interface Props {
  openModal: () => void;
}

const Alarm = ({ openModal }: Props) => {
  const {
    states: { isAlarmUsing, alarmText },
    actions: { setIsAlarmUsing },
  } = useAlarm(openModal);

  return (
    <View
      style={{
        height: 50,
        justifyContent: 'center',
        borderBottomColor: COLOR.sub4,
        borderBottomWidth: 0.3,
      }}
    >
      <View style={styles.item}>
        <View style={styles.itemTitleWrapper}>
          <AlarmClockIcon />
          <Text style={styles.itemTitle}>알람</Text>
        </View>
        <Switch
          trackColor={{ true: COLOR.main1 }}
          thumbColor="white"
          value={isAlarmUsing}
          onValueChange={setIsAlarmUsing}
        />
      </View>
      {isAlarmUsing && (
        <View style={styles.usingView}>
          <Pressable onPress={openModal}>
            <View style={styles.usingItemWrapper}>
              <Text style={styles.usingItemText}>{alarmText}</Text>
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
  itemTitle: { marginLeft: 8, fontFamily: 'Apple500', fontSize: 16, color: COLOR.sub2 },
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

export default Alarm;
