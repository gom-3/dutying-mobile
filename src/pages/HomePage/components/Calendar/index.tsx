import { Pressable, StyleSheet, Text, View } from 'react-native';
import Shift from '../../../../components/Shift';
import { COLOR } from 'index.style';
import useCalendar from './index.hook';
import useDeviceCalendar from 'hooks/useDeviceCalendar';

export type DateType = {
  date: Date;
  shift: number | undefined;
  schedules: Schedule[];
};

export const days = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar = () => {
  const {
    state: { weeks, shiftTypes, date, today },
    actions: { dateClickHandler, isSameDate },
  } = useCalendar();

  useDeviceCalendar();

  return (
    <View style={styles.calendar}>
      <View style={styles.calendarHeader}>
        {days.map((day) => (
          <View key={day} style={styles.calendarHeaderDay}>
            <Text
              style={day === '일' ? styles.sunday : day === '토' ? styles.saturday : styles.weekday}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
      {weeks.map((week, i) => (
        <View key={i} style={{ flexDirection: 'row', borderColor: '#d6d6de', borderTopWidth: 0.5 }}>
          {week.map((day) => (
            <Pressable key={day.date.getTime()} style={styles.day} onPress={() => dateClickHandler(day.date)}>
              <View
                style={[
                  styles.day,
                  { backgroundColor: isSameDate(today, day.date) ? COLOR.sub5 : 'white' },
                ]}
              >
                <Shift
                  date={day.date.getDate()}
                  shift={day.shift !== undefined ? shiftTypes[day.shift] : undefined}
                  isCurrent={date.getMonth() === day.date.getMonth()}
                  isToday={isSameDate(today, day.date)}
                  fullNameVisibilty={false}
                />
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6de',
  },
  calendarHeaderDay: {
    flex: 1,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunday: {
    color: 'red',
    fontFamily: 'Apple',
  },
  saturday: {
    color: 'blue',
  },
  weekday: {
    color: 'black',
  },
  week: {
    flexDirection: 'row',
  },
  day: {
    flex: 1,
    height: 88,
    backgroundColor: 'white',
  },
});

export default Calendar;
