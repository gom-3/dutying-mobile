import { days } from '@pages/HomePage/components/Calendar';
import Shift from '@components/Shift';
import useCalendar from './index.hook';
import { COLOR, PageViewContainer } from 'index.style';
import { View, Text, Pressable, Button, StyleSheet } from 'react-native';

const RegistDuty = () => {
  const {
    state: { date, weeks, selectedDate, shiftTypes, shiftTypesCount },
    actions: { insertShift, deleteShift, isSameDate, selectDate, saveRegistDutyChange },
  } = useCalendar();
  return (
    <PageViewContainer>
      <View style={styles.calendarHeaderView}>
        {days.map((day) => (
          <View style={styles.dayView}>
            <Text
              style={[
                styles.dayText,
                {
                  color: day === '일' ? 'red' : day === '토' ? 'blue' : 'black',
                },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
      {weeks.map((week, i) => (
        <View style={styles.weekView}>
          {week.map((day, j) => (
            <Pressable
              style={{
                flex: 1,
                height: 67,
                backgroundColor: isSameDate(selectedDate, day.date) ? COLOR.sub5 : 'white',
              }}
              onPress={() => selectDate(day.date)}
            >
              <View
                style={[
                  styles.dateView,
                  {
                    backgroundColor: isSameDate(selectedDate, day.date) ? COLOR.sub5 : 'white',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    { opacity: date.getMonth() === day.date.getMonth() ? 1 : 0.3 },
                  ]}
                >
                  {day.date.getDate()}
                </Text>
                <Shift
                  date={day.date.getDate()}
                  shift={day.shift !== undefined ? shiftTypes[day.shift] : undefined}
                  isCurrent={date.getMonth() === day.date.getMonth()}
                  isToday={isSameDate(day.date, selectedDate)}
                  fullNameVisibilty
                />
              </View>
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.registView}>
        <View style={styles.registHeaderView}>
          <Text style={styles.registHeaderText}>근무 유형 선택</Text>
          <Pressable onPress={deleteShift}>
            <View
              style={styles.deleteShiftView}
            >
              <Text style={styles.deleteShiftText}>삭제</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.registShiftItemsView}>
          {shiftTypes.map((shift, i) => (
            <Pressable onPress={() => insertShift(i)}>
              <View style={styles.shiftItemView}>
                <Text style={styles.shiftCountText}>
                  {shiftTypesCount[i]}
                </Text>
                <View
                  style={[styles.shiftView, {backgroundColor:shift.color}]}
                >
                  <Text
                    style={styles.shiftShortNameText}
                  >
                    {shift.shortName}
                  </Text>
                  <Text
                    style={styles.shiftFullNameText}
                  >
                    {shift.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  calendarHeaderView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6de',
  },
  dayView: { flex: 1, marginVertical: 10, justifyContent: 'center', alignItems: 'center' },
  dayText: {
    fontFamily: 'Apple',
  },
  weekView: { flexDirection: 'row', borderColor: '#d6d6de', borderTopWidth: 0.5 },
  dayPressable: {},
  dateView: { flex: 1, height: 67 },
  dateText: {
    marginLeft: 10,
    marginTop: 4,
    fontFamily: 'Poppins500',
    fontSize: 12,
    color: COLOR.sub2,
  },
  registView: {
    height: '100%',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#fdfcfe',
  },
  registHeaderView: { flexDirection: 'row', justifyContent: 'space-between' },
  registHeaderText: { fontSize: 14, fontFamily: 'Apple', color: COLOR.sub2 },
  deleteShiftView: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLOR.main2,
    borderRadius: 20,
  },
  deleteShiftText: { fontSize: 12, fontFamily: 'Apple', color: COLOR.main2 },
  registShiftItemsView:{ flexDirection: 'row', marginTop: 26 },
  shiftItemView: { alignItems: 'center', justifyContent: 'center' },
  shiftCountText: { fontFamily: 'Poppins', color: COLOR.sub25, fontSize: 12 },
  shiftView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 3,
    borderRadius: 10,
  },
  shiftShortNameText: { color: 'white', fontFamily: 'Poppins500', fontSize: 20, height: 30 },
  shiftFullNameText: { marginLeft: 5, color: 'white', fontFamily: 'Apple', fontSize: 14 },
});

export default RegistDuty;
