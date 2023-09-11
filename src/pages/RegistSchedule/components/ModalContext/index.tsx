import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { COLOR } from 'index.style';
import { Alarm, RecurrenceRule } from 'expo-calendar';
import { useMemo } from 'react';
import { alarmList, getRecurrenceRuleList } from '@libs/utils/event';
import BottomSheetHeader from '@components/BottomSheetHeader';

interface Props {
  closeModal: () => void;
}

const ModalContext = ({ closeModal }: Props) => {
  const [modalName, alarmText, recurrenceRuleText, startDate, setState] = useScheduleStore(
    (state) => [
      state.modalName,
      state.alarmText,
      state.recurrenceRuleText,
      state.startDate,
      state.setState,
    ],
  );

  const recurrenceRuleList = useMemo(() => getRecurrenceRuleList(startDate), [startDate]);

  const setAlarm = (text: string, time: number) => {
    const alarm: Alarm = { relativeOffset: time };
    setState('alarms', [alarm]);
    setState('alarmText', text);
    closeModal();
  };

  const setRepeat = (text: string, frequency: string) => {
    const recurrenceRule: RecurrenceRule = { frequency };
    setState('recurrenceRule', recurrenceRule);
    setState('recurrenceRuleText', text);
    closeModal();
  };

  if (modalName === 'date')
    return (
      <View>
        <View>
          <Text>시간 설정</Text>
        </View>
      </View>
    );
  else if (modalName === 'alarm')
    return (
      <View style={styles.container}>
        <BottomSheetHeader title="알람" onPressExit={closeModal} onPressCheck={closeModal} />
        {alarmList.map((alarm) => (
          <TouchableOpacity
            key={alarm.text}
            style={styles.item}
            onPress={() => setAlarm(alarm.text, alarm.time)}
          >
            <Text
              style={[
                styles.itemText,
                {
                  color: alarmText === alarm.text ? COLOR.main1 : COLOR.sub2,
                  fontFamily: alarmText === alarm.text ? 'Apple600' : 'Apple',
                  textDecorationLine: alarmText === alarm.text ? 'underline' : 'none',
                },
              ]}
            >
              {alarm.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  else if (modalName === 'category')
    return (
      <View>
        <View>
          <Text>알람</Text>
        </View>
      </View>
    );
  else
    return (
      <View style={styles.container}>
        <BottomSheetHeader title="반복" onPressExit={closeModal} onPressCheck={closeModal} />
        {recurrenceRuleList.map((recurrenceRule) => (
          <TouchableOpacity
            key={recurrenceRule.text}
            style={styles.item}
            onPress={() => setRepeat(recurrenceRule.text, recurrenceRule.frequency)}
          >
            <Text
              style={[
                styles.itemText,
                {
                  color: recurrenceRuleText === recurrenceRule.text ? COLOR.main1 : COLOR.sub2,
                  fontFamily: recurrenceRuleText === recurrenceRule.text ? 'Apple600' : 'Apple',
                  textDecorationLine:
                    recurrenceRuleText === recurrenceRule.text ? 'underline' : 'none',
                },
              ]}
            >
              {recurrenceRule.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  item: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Apple500',
  },
});

export default ModalContext;
