import { COLOR } from 'index.style';
import { View, Text, StyleSheet, Switch, Pressable, Platform } from 'react-native';
import ClockIcon from '@assets/svgs/clock.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import useTimeHook from './index.hook';
import OutsidePressHandler from 'react-native-outside-press';

const Time = () => {
  const {
    states: { using, isOpen, mode, startDate, endDate, value },
    actions: { setUsing, setIsOpen, datePressHander, onChange },
  } = useTimeHook();

  const DateSelector = ({
    date,
    mode,
    dateString,
  }: {
    date: Date;
    mode: 'date' | 'time';
    dateString: 'startDate' | 'endDate';
  }) => {
    return (
      <Pressable onPress={() => datePressHander(mode, date, dateString)}>
        <View style={styles.usingItemWrapper}>
          <Text style={styles.usingItemText}>
            {mode === 'date'
              ? `${date.getMonth() + 1}월 ${date.getDate()}일`
              : `${date.getHours().toString().padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <OutsidePressHandler disabled={false} onOutsidePress={()=>setIsOpen(false)}>
        <View style={styles.item}>
          <View style={styles.itemTitleWrapper}>
            <ClockIcon />
            <Text style={styles.itemTitle}>시간 설정</Text>
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
            {isOpen && (
              <DateTimePicker
                mode={mode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={value}
                onChange={onChange}
              />
            )}
            <Text style={styles.itemTitle}>날짜</Text>
            <View style={styles.itemTitleWrapper}>
              <DateSelector mode="date" date={startDate} dateString="startDate" />
              <DateSelector mode="date" date={endDate} dateString="endDate" />
            </View>
            <Text style={[styles.itemTitle, { marginTop: 14 }]}>시간</Text>
            <View style={styles.itemTitleWrapper}>
              <DateSelector mode="time" date={startDate} dateString="startDate" />
              <DateSelector mode="time" date={endDate} dateString="endDate" />
            </View>
          </View>
        )}
      </OutsidePressHandler>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 10,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
  usingView: { marginHorizontal: 24, marginVertical: 5 },
  usingItemWrapper: { flexDirection: 'row' },
  usingItemTitle: { fontFamily: 'Apple', fontSize: 10, color: COLOR.sub3 },
  usingItemText: {
    marginTop: 4,
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default Time;
