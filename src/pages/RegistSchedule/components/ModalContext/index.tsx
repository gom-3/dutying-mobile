import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ExitIcon from '@assets/svgs/exit.svg';
import CheckIcon from '@assets/svgs/check.svg';
import { useScheduleStore } from 'store/schedule';
import { COLOR } from 'index.style';
import { Alarm, RecurrenceRule } from 'expo-calendar';
import { useMemo } from 'react';
import { alarmList, getRecurrenceRuleList } from '@libs/utils/event';

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
        <View style={styles.header}>
          <ExitIcon onPress={closeModal} />
          <Text>알람</Text>
          <CheckIcon onPress={closeModal} />
        </View>
        {alarmList.map((alarm) => (
          <TouchableOpacity
            key={alarm.text}
            style={styles.item}
            onPress={() => setAlarm(alarm.text, alarm.time)}
          >
            <Text
              style={[
                styles.itemText,
                { color: alarmText === alarm.text ? COLOR.sub1 : COLOR.sub25 },
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
        <View style={styles.header}>
          <ExitIcon onPress={closeModal} />
          <Text>반복</Text>
          <CheckIcon onPress={closeModal} />
        </View>
        {recurrenceRuleList.map((recurrenceRule) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setRepeat(recurrenceRule.text, recurrenceRule.frequency)}
          >
            <Text
              style={[
                styles.itemText,
                { color: recurrenceRuleText === recurrenceRule.text ? COLOR.sub1 : COLOR.sub25 },
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  item: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Apple',
  },
});

export default ModalContext;
