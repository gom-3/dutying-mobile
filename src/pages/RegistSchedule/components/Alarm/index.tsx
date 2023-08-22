import { COLOR } from 'index.style';
import { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Platform } from 'react-native';
import AlarmClockIcon from '@assets/svgs/clock-alarm.svg';
import useAlarm from './index.hook';

interface Props {
  openModal: () => void;
}

const Alarm = ({ openModal }: Props) => {
  const {
    states: { using, alarmText },
    actions: { setUsing },
  } = useAlarm(openModal);

  return (
    <>
      <View style={styles.item}>
        <View style={styles.itemTitleWrapper}>
          <AlarmClockIcon />
          <Text style={styles.itemTitle}>알람</Text>
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
              <Text style={styles.usingItemText}>{alarmText}</Text>
            </View>
          </Pressable>
        </View>
      )}
    </>
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

export default Alarm;