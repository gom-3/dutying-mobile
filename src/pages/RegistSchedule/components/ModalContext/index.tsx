import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ExitIcon from '@assets/svgs/exit.svg';
import CheckIcon from '@assets/svgs/check.svg';
import { useScheduleStore } from 'store/schedule';
import { COLOR } from 'index.style';
import { Alarm, Frequency, RecurrenceRule } from 'expo-calendar';
import { days } from '@pages/HomePage/components/Calendar';

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

  const alarmList = [
    { text: '정각', time: 0 },
    { text: '10분 전', time: -10 },
    { text: '30분 전', time: -30 },
    { text: '1시간 전', time: -60 },
    { text: '1일 전', time: 0 },
  ];

  const repeatList = [
    { text: '매일', frequency: Frequency.DAILY },
    { text: `매주 ${days[startDate.getDay()]}요일`, frequency: Frequency.WEEKLY },
    { text: `매월 ${startDate.getDate()}일`, frequency: Frequency.MONTHLY },
    {
      text: `매년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일`,
      frequency: Frequency.YEARLY,
    },
  ];

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
          <TouchableOpacity style={styles.item} onPress={() => setAlarm(alarm.text, alarm.time)}>
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
        {repeatList.map((repeat) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setRepeat(repeat.text, repeat.frequency)}
          >
            <Text
              style={[
                styles.itemText,
                { color: recurrenceRuleText === repeat.text ? COLOR.sub1 : COLOR.sub25 },
              ]}
            >
              {repeat.text}
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
