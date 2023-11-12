import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '@assets/svgs/check.svg';
import MonthSelector from '@components/MonthSelector';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { days, initMonthCalendarDates, isSameDate } from '@libs/utils/date';
import { COLOR } from 'index.style';
import { useMemo, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import TrashIcon from '@assets/svgs/trash-color.svg';
import { images } from '@assets/images/profiles';
import { useQuery } from '@tanstack/react-query';
import { WardShift, getWardShiftRequest } from '@libs/api/ward';
import { useAccountStore } from 'store/account';

const mockShift = [
  { shortName: 'D', name: '데이', color: '#4dc2ad' },
  { shortName: 'E', name: '이브닝', color: '#ff8ba5' },
  { shortName: 'N', name: '나이트', color: '#3580ff' },
  { shortName: 'O', name: '오프', color: '#465b7a' },
];

const RequestShift = () => {
  const [account] = useAccountStore((state) => [state.account]);
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const year = date.getFullYear();
  const month = date.getMonth();
  const [dateIndex, setDateIndex] = useState(
    date.getDate() + new Date(year, month, 1).getDay() - 1,
  );

  const { data: shiftRequests } = useQuery(
    ['getShiftRequests', account.wardId, account.shiftTeamId, year, month],
    () => getWardShiftRequest(account.wardId, account.shiftTeamId, year, month),
  );

  const shiftRequestDays = useMemo(() => {
    if (!shiftRequests) return [];
    const array: WardShift[][] = [];
    for (let i = 0; i < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); i++) {
      array.push([]);
    }
    array.forEach((day, i) =>
      shiftRequests.forEach((nurse) => {
        if (nurse.accountShiftTypes[i]) {
          day.push(nurse.accountShiftTypes[i]);
        }
      }),
    );
    return array;
  }, [shiftRequests]);

  console.log(shiftRequests);
  // console.log(shiftRequestDays);

  const weeks = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const calendar: { date: Date; shift: number | null }[] = [];
    for (let i = first.getDay() - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      calendar.push({ date, shift: null });
    }
    for (let i = 1; i <= last.getDate(); i++) {
      const date = new Date(year, month, i);
      calendar.push({ date, shift: null });
    }
    for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
      const date = new Date(year, month + 1, j);
      calendar.push({ date, shift: null });
    }
    const weeks: { date: Date; shift: number | null }[][] = [];
    while (calendar.length > 0) weeks.push(calendar.splice(0, 7));
    return weeks;
  }, [year, month]);

  const [selectedTab, setSelectedTab] = useState<'request' | 'list'>('request');

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader
            title="근무 신청하기"
            rightItems={
              <TouchableOpacity>
                <CheckIcon />
              </TouchableOpacity>
            }
          />
          <ScrollView>
            <MonthSelector style={{ marginLeft: 26, marginTop: 20, marginBottom: 12 }} />
            <View style={styles.calendarHeaderView}>
              {days.map((day) => (
                <View key={day} style={styles.dayView}>
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: day === '일' ? '#FF99AA' : day === '토' ? '#8B9BFF' : COLOR.sub25,
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
                  const isSame = isSameDate(date, day.date);
                  const isSameMonth = date.getMonth() === day.date.getMonth();
                  return (
                    <TouchableOpacity
                      key={day.date.getTime()}
                      style={{
                        flex: 1,
                        height: 67,
                      }}
                      onPress={() => setState('date', day.date)}
                    >
                      <View
                        style={[
                          styles.dateView,
                          {
                            backgroundColor: isSame ? COLOR.main4 : 'white',
                          },
                        ]}
                      >
                        <Text style={[styles.dateText, { opacity: isSameMonth ? 1 : 0.3 }]}>
                          {day.date.getDate()}
                        </Text>
                        {/* <Shift
                          date={day.date.getDate()}
                          shift={day.shift !== null ? shiftTypes.get(day.shift) : undefined}
                          isCurrent={isSameMonth}
                          isToday={isSame}
                          fullNameVisibilty
                        /> */}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setSelectedTab('request')}
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  backgroundColor: selectedTab === 'request' ? COLOR.main1 : COLOR.sub5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: selectedTab === 'request' ? 'white' : COLOR.sub25,
                    fontFamily: 'Apple500',
                    fontSize: 14,
                  }}
                >
                  근무 신청하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedTab('list')}
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  backgroundColor: selectedTab === 'list' ? COLOR.main1 : COLOR.sub5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: selectedTab === 'list' ? 'white' : COLOR.sub25,
                    fontFamily: 'Apple500',
                    fontSize: 14,
                  }}
                >
                  신청 현황 보기
                </Text>
              </TouchableOpacity>
            </View>
            {selectedTab === 'request' ? (
              <View>
                <View
                  style={{
                    margin: 24,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'Apple500', fontSize: 14, color: COLOR.sub2 }}>
                    신청할 근무 유형 선택
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: COLOR.main2,
                      paddingVertical: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={{ color: COLOR.main1, fontSize: 12, fontFamily: 'Apple' }}>
                      삭제
                    </Text>
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {mockShift.map((shift) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={shift.color}
                      // onPress={() => insertShift(shift.accountShiftTypeId)}
                      delayLongPress={700}
                      // onLongPress={() => longPressShift(shift)}
                      style={styles.shiftItemView}
                    >
                      <View style={[styles.shiftView, { backgroundColor: shift.color }]}>
                        <Text style={styles.shiftShortNameText}>{shift.shortName}</Text>
                        <Text style={styles.shiftFullNameText}>{shift.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: COLOR.sub45,
                    borderBottomWidth: 0.5,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={{ uri: `data:image/png;base64,${images[0]}` }}
                      style={{ width: 24, height: 24, borderRadius: 100 }}
                    />
                    <Text
                      style={{
                        marginLeft: 8,
                        color: COLOR.sub2,
                        fontSize: 16,
                        fontFamily: 'Apple500',
                      }}
                    >
                      조성연
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#4dc2ad',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 54,
                      height: 26,
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Apple500' }}>D</Text>
                    <Text
                      style={{
                        marginLeft: 2,
                        color: 'white',
                        fontSize: 10,
                        fontFamily: 'Apple500',
                      }}
                    >
                      데이
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
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
    fontSize: 12,
  },
  weekView: { flexDirection: 'row', borderColor: '#d6d6de', borderTopWidth: 0.5 },
  dateView: { flex: 1, height: 67 },
  dateText: {
    marginLeft: 10,
    marginTop: 4,
    fontFamily: 'Poppins500',
    fontSize: 12,
    color: COLOR.sub2,
  },
  shiftItemView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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

export default RequestShift;
