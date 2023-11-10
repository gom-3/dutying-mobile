import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Shift from '@components/Shift';
import { COLOR } from 'index.style';
import useCalendar from './index.hook';
import { Schedule } from '@hooks/useDeviceCalendar';
import { days, isSameDate } from '@libs/utils/date';
import { hexToRgba } from '@libs/utils/color';
import { PanGestureHandler } from 'react-native-gesture-handler';
import GrayDotsIcon from '@assets/svgs/dots-gray.svg';
import useWidget from '@hooks/useWidget';

export type DateType = {
  date: Date;
  shift: number | null;
  schedules: Schedule[];
};

interface Props {
  withoutSchedule?: boolean;
}

const ElseSchedule = ({ lefts, level }: { lefts: number; level: number }) => {
  return (
    <View style={[styles.elseView, { top: 27 + (level - 1) * 16 }]}>
      <Text style={styles.elseText}>외 {lefts}개</Text>
      <GrayDotsIcon />
    </View>
  );
};

const Calendar = ({ withoutSchedule }: Props) => {
  const {
    state: { weeks, shiftTypes, date, today },
    actions: { dateClickHandler, onHandlerStateChange },
  } = useCalendar(true);

  return (
    <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
      <ScrollView style={styles.calendar} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarHeader}>
          {days.map((day) => (
            <View key={day} style={styles.calendarHeaderDay}>
              <Text
                style={
                  day === '일' ? styles.sunday : day === '토' ? styles.saturday : styles.weekday
                }
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        {weeks.map((week, i) => (
          <View key={i} style={styles.week}>
            {week.map((day, j) => {
              // console.log(day);
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={day.date.getTime()}
                  style={[styles.day, { height: weeks.length === 6 ? 93 : 109 }]}
                  onPress={() => {
                    if (date.getMonth() === day.date.getMonth())
                      dateClickHandler(day.date, i * 7 + j);
                  }}
                >
                  <View style={[styles.day, { height: weeks.length === 6 ? 93 : 109 }]}>
                    <Shift
                      date={day.date.getDate()}
                      shift={
                        day.shift && shiftTypes.size > 0 ? shiftTypes.get(day.shift) : undefined
                      }
                      isCurrent={date.getMonth() === day.date.getMonth()}
                      isToday={isSameDate(today, day.date)}
                      fullNameVisibilty={false}
                    />
                    {!withoutSchedule &&
                      day.date.getMonth() === date.getMonth() &&
                      day.schedules.map((schedule, j) => {
                        if (weeks.length === 6 && schedule.level > 4) return;
                        if (weeks.length < 6 && schedule.level > 5) return;
                        if (weeks.length === 6 && schedule.level === 4) {
                          return (
                            <ElseSchedule
                              key={schedule.id}
                              level={4}
                              lefts={day.schedules.length - 3}
                            />
                          );
                        }
                        if (weeks.length < 6 && schedule.level === 5) {
                          return (
                            <ElseSchedule
                              key={schedule.id}
                              level={5}
                              lefts={day.schedules.length - 4}
                            />
                          );
                        }
                        return (
                          <View
                            key={schedule.id}
                            style={[
                              styles.scheduleView,
                              {
                                backgroundColor: hexToRgba(schedule.color, 0.3),
                                top: 27 + (schedule.level - 1) * 16,
                                width:
                                  schedule.isStart ||
                                  day.date.getDay() === 0 ||
                                  (day.date.getMonth() === date.getMonth() &&
                                    day.date.getDate() === 1)
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
                                    backgroundColor: schedule.color,
                                  },
                                ]}
                              />
                            )}
                            {(schedule.isStart ||
                              day.date.getDay() === 0 ||
                              day.date.getDate() === 1) && (
                              <Text numberOfLines={1} style={styles.scheduleText}>
                                {schedule.title}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{ height: 86 }} />
      </ScrollView>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.2,
    borderBottomColor: '#d6d6de',
  },
  calendarHeaderDay: {
    flex: 1,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunday: {
    color: '#FF99AA',
    fontSize: 12,
    fontFamily: 'Apple',
  },
  saturday: {
    fontFamily: 'Apple',
    fontSize: 12,
    color: '#8B9BFF',
  },
  weekday: {
    fontFamily: 'Apple',
    fontSize: 12,
    color: COLOR.sub25,
  },
  week: {
    flexDirection: 'row',
    borderColor: '#d6d6de',
    borderTopWidth: 0.5,
  },
  day: {
    flex: 1,
    position: 'relative',
  },
  elseView: {
    position: 'absolute',
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
    width: '98%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: COLOR.sub5,
  },
  elseText: {
    fontFamily: 'Apple',
    color: COLOR.sub25,
    fontSize: 10,
    marginHorizontal: 5,
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
