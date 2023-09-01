import { COLOR } from 'index.style';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import ClockIcon from '@assets/svgs/clock.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import useTimeHook from './index.hook';
import OutsidePressHandler from 'react-native-outside-press';
import DatePicker from '@components/DatePicker';

const Time = () => {
  const {
    states: { using, isOpen, mode, startDate, endDate, value },
    actions: { setUsing, setIsOpen, datePressHander, onChange },
  } = useTimeHook();

  const DateSelector = ({
    date,
    mode,
    dateString,
    text,
    style,
  }: {
    date: Date;
    mode: 'date' | 'time';
    dateString: 'startDate' | 'endDate';
    text: string;
    style?: StyleProp<ViewStyle>;
  }) => {
    return (
      <Pressable style={style} onPress={() => datePressHander(mode, date, dateString)}>
        <Text style={styles.usingItemTitle}>{text}</Text>
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
      <OutsidePressHandler disabled={false} onOutsidePress={() => setIsOpen(false)}>
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
            <View style={styles.itemTitleWrapper}>
              <DateSelector mode="date" date={startDate} dateString="startDate" text="시작일" />
              <DateSelector
                style={{ marginLeft: 24 }}
                mode="date"
                date={endDate}
                dateString="endDate"
                text="종료일"
              />
            </View>
            <View style={[styles.itemTitleWrapper, { marginTop: 18 }]}>
              <DateSelector mode="time" date={startDate} dateString="startDate" text="시작 시간" />
              <DateSelector
                style={{ marginLeft: 37 }}
                mode="time"
                date={endDate}
                dateString="endDate"
                text="종료 시간"
              />
            </View>
            {/* <DatePicker
              date={new Date()}
              dateString="startDate"
              mode="date"
              onPress={() => console.log(1)}
            /> */}
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
    marginVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
  usingView: { marginHorizontal: 24, marginVertical: 0 },
  usingItemTitle: { fontFamily: 'Apple', fontSize: 10, color: COLOR.sub3 },
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

export default Time;
