import { Pressable, StyleSheet, Text, View } from 'react-native';
import Shift from '@components/Shift';
import { COLOR } from 'index.style';
import useCalendar from './index.hook';
import useDeviceCalendar from 'hooks/useDeviceCalendar';
import { Schedule } from '@hooks/useDeviceCalendar';
import { days, isSameDate } from '@libs/utils/date';

export type DateType = {
  date: Date;
  shift: number | null;
  schedules: Schedule[];
};

interface Props {
  withoutSchedule?: boolean;
}

const Calendar = ({ withoutSchedule }: Props) => {
  const {
    state: { weeks, shiftTypes, date, today },
    actions: { dateClickHandler },
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
        <View key={i} style={styles.week}>
          {week.map((day) => (
            <Pressable
              key={day.date.getTime()}
              style={[styles.day, { height: weeks.length === 6 ? 93 : 109 }]}
              onPress={() => dateClickHandler(day.date)}
            >
              <View style={[styles.day, { height: weeks.length === 6 ? 93 : 109 }]}>
                <Shift
                  date={day.date.getDate()}
                  shift={day.shift && shiftTypes.size > 0 ? shiftTypes.get(day.shift) : undefined}
                  isCurrent={date.getMonth() === day.date.getMonth()}
                  isToday={isSameDate(today, day.date)}
                  fullNameVisibilty={false}
                />
                {!withoutSchedule &&
                  day.schedules.map((schedule, j) => {
                    if (weeks.length === 6 && schedule.level > 4) return;
                    if (weeks.length < 6 && schedule.level > 5) return;

                    return (
                      <View
                        key={schedule.title}
                        style={[
                          styles.scheduleView,
                          {
                            backgroundColor: '#5AF8F84D',
                            top: 27 + (schedule.level - 1) * 16,
                            width:
                              schedule.isStart || day.date.getDay() === 0
                                ? `${schedule.leftDuration * 100 + 98}%`
                                : 0,
                            borderTopLeftRadius: schedule.isStart ? 2 : 0,
                            borderBottomLeftRadius: schedule.isStart ? 2 : 0,
                            borderTopRightRadius: schedule.isEnd ? 2 : 0,
                            borderBottomRightRadius: schedule.isEnd ? 2 : 0,
                          },
                        ]}
                      >
                        {schedule.isStart && (
                          <View
                            style={[
                              styles.scheduleStartView,
                              {
                                backgroundColor: '#5AF8F8',
                              },
                            ]}
                          />
                        )}
                        {(schedule.isStart || day.date.getDay() === 0) && (
                          <Text numberOfLines={1} style={styles.scheduleText}>
                            {schedule.title}
                          </Text>
                        )}
                      </View>
                    );
                  })}
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
    borderColor: '#d6d6de',
    borderTopWidth: 0.5,
  },
  day: {
    flex: 1,
    // backgroundColor: 'white',
    position: 'relative',
  },
  scheduleView: {
    position: 'absolute',
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleStartView: {
    width: 4,
    height: '100%',
    borderRadius: 2,
  },
  scheduleText: {
    fontFamily: 'Poppins',
    color: COLOR.sub2,
    fontSize: 10,
    marginLeft: 4,
  },
});

export default Calendar;
