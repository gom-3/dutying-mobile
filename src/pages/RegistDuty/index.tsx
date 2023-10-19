import Shift from '@components/Shift';
import useRegistDuty from './index.hook';
import { COLOR } from 'index.style';
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import PageViewContainer from '@components/PageView';
import PageHeader from '@components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import MonthSelector from '@components/MonthSelector';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { days, isSameDate } from '@libs/utils/date';
import CheckIcon from '@assets/svgs/check.svg';
import TrashIcon from '@assets/svgs/trash-color.svg';
import EditIcon from '@assets/svgs/edit-shift-type-gray.svg';
import { useRoute } from '@react-navigation/native';

const RegistDuty = () => {
  const route = useRoute<any>();
  const { params } = route;
  const dateFrom = params ? params.dateFrom : undefined;
  const {
    state: { date, weeks, selectedDate, shiftTypes, shiftTypesCount },
    actions: {
      insertShift,
      deleteShift,
      selectDate,
      saveRegistDutyChange,
      navigateToShiftType,
      longPressShift,
    },
  } = useRegistDuty(dateFrom);

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader
            title="근무 등록"
            rightItems={
              <Pressable onPress={saveRegistDutyChange}>
                <CheckIcon />
              </Pressable>
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 22 }}>
            <MonthSelector />
          </View>
          <View style={styles.calendarHeaderView}>
            {days.map((day) => (
              <View key={day} style={styles.dayView}>
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
            <View key={i} style={styles.weekView}>
              {week.map((day) => {
                const isSame = isSameDate(selectedDate, day.date);
                const isSameMonth = date.getMonth() === day.date.getMonth();
                return (
                  <Pressable
                    key={day.date.getTime()}
                    style={{
                      flex: 1,
                      height: 67,
                    }}
                    onPress={() => selectDate(day.date)}
                  >
                    <View
                      style={[
                        styles.dateView,
                        {
                          backgroundColor: isSame ? COLOR.sub5 : 'white',
                        },
                      ]}
                    >
                      <Text style={[styles.dateText, { opacity: isSameMonth ? 1 : 0.3 }]}>
                        {day.date.getDate()}
                      </Text>
                      <Shift
                        date={day.date.getDate()}
                        shift={day.shift !== null ? shiftTypes.get(day.shift) : undefined}
                        isCurrent={isSameMonth}
                        isToday={isSame}
                        fullNameVisibilty
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
          <View style={styles.registView}>
            <View style={styles.registHeaderView}>
              <Text style={styles.registHeaderText}>근무 유형 선택</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={navigateToShiftType}
                  style={{ marginRight: 8, padding: 4 }}
                >
                  <EditIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteShift} style={{ padding: 4 }}>
                  <View style={styles.deleteShiftView}>
                    <Text style={styles.deleteShiftText}>삭제</Text>
                    <TrashIcon />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.registShiftItemsView}>
              {Array.from(shiftTypes.values()).map((shift) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={shift.name}
                  onPress={() => insertShift(shift.accountShiftTypeId)}
                  delayLongPress={700}
                  onLongPress={() => longPressShift(shift)}
                >
                  <View style={styles.shiftItemView}>
                    <Text style={styles.shiftCountText}>
                      {shiftTypesCount.get(shift.accountShiftTypeId) || 0}
                    </Text>
                    <View style={[styles.shiftView, { backgroundColor: shift.color }]}>
                      <Text style={styles.shiftShortNameText}>{shift.shortName}</Text>
                      <Text style={styles.shiftFullNameText}>{shift.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </BottomSheetModalProvider>
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
    paddingVertical: 10,
    backgroundColor: '#fdfcfe',
  },
  registHeaderView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  registHeaderText: { fontSize: 14, fontFamily: 'Apple', color: COLOR.sub2 },
  deleteShiftView: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLOR.main2,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  deleteShiftText: { fontSize: 12, fontFamily: 'Apple', color: COLOR.main2 },
  registShiftItemsView: {
    flexDirection: 'row',
    marginTop: 26,
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  shiftItemView: { alignItems: 'center', justifyContent: 'center' },
  shiftCountText: { fontFamily: 'Poppins', color: COLOR.sub25, fontSize: 12 },
  shiftView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 18,
    width: 80,
    paddingVertical: 3,
    borderRadius: 10,
  },
  shiftShortNameText: { color: 'white', fontFamily: 'Apple600', fontSize: 20, height: 29 },
  shiftFullNameText: { marginLeft: 5, color: 'white', fontFamily: 'Apple', fontSize: 14 },
});

export default RegistDuty;
