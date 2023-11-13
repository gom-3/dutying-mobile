import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import WardHeader from '../components/WardHeader';
import NavigationBar from '@components/NavigationBar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import MonthSelector from '@components/MonthSelector';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { COLOR } from 'index.style';
import { days, initMonthCalendarDates, isSameDate } from '@libs/utils/date';
import { useMemo } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { useLinkProps } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { wardKeys } from '@libs/api/queryKey';
import { useAccountStore } from 'store/account';
import {
  WardShift,
  WardShiftsDTO,
  WardUser,
  getWardMembers,
  getWardShiftRequest,
} from '@libs/api/ward';
import LottieLoading from '@components/LottieLoading';

export const getDayRequestShiftLists = (
  requestShiftList: WardShiftsDTO | undefined,
  date: Date,
  linkedMemberListMap: Map<number, WardUser>,
) => {
  const array: { shift: WardShift; name: string; profileImgBase64: string | undefined }[][] = [];
  if (requestShiftList) {
    for (let i = 0; i < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); i++) {
      array.push([]);
    }
    array.forEach((day, i) =>
      requestShiftList.forEach((nurse) => {
        if (nurse.accountShiftTypes[i]) {
          day.push({
            shift: nurse.accountShiftTypes[i],
            name: nurse.name,
            profileImgBase64: linkedMemberListMap.get(nurse.accountId)?.profileImgBase64,
          });
        }
      }),
    );
  }
  return array;
};

// TODO: 뷰 로직 분리
// TODO: 스타일 정리
const RequestWardShiftPage = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [account] = useAccountStore((state) => [state.account]);
  const { onPress: navigateToRequestConfirm } = useLinkProps({
    to: { screen: 'RequestWardShiftConfirm' },
  });
  const year = date.getFullYear();
  const month = date.getMonth();
  const weeks = useMemo(() => {
    return initMonthCalendarDates(year, month);
  }, [year, month]);

  /** 연동된 간호사 정보 memo */
  const { data: linkedMemberList, isLoading: isMemberListLoading } = useQuery(
    wardKeys.linkedMembers(account.wardId, account.shiftTeamId),
    () => getWardMembers(account.wardId, account.shiftTeamId),
  );
  const linkedMemberListMap = useMemo(() => {
    const map = new Map<number, WardUser>();
    if (linkedMemberList) {
      linkedMemberList.forEach((member) => map.set(member.accountId, member));
    }
    return map;
  }, [linkedMemberList]);

  /** 날짜별 신청 근무 목록 memo */
  const { data: requestShiftList, isLoading: isRequestShiftListLoading } = useQuery(
    wardKeys.requestList(account.wardId, account.shiftTeamId, year, month),
    () => getWardShiftRequest(account.wardId, account.shiftTeamId, year, month),
    {
      enabled: !!linkedMemberList && linkedMemberListMap.size > 0,
    },
  );
  const dayRequestShiftLists = useMemo(() => {
    return getDayRequestShiftLists(requestShiftList, date, linkedMemberListMap);
  }, [requestShiftList]);
  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <WardHeader tab="request" />
          <View
            style={{
              marginHorizontal: 26,
              marginTop: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <MonthSelector />
            <TouchableOpacity
              onPress={navigateToRequestConfirm}
              style={{
                flexDirection: 'row',
                borderRadius: 5,
                backgroundColor: COLOR.main4,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderColor: COLOR.main1,
              }}
            >
              <Text style={{ color: COLOR.main1, fontFamily: 'Apple600', fontSize: 14 }}>
                근무 신청하기
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
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
                  const isSame = isSameDate(date, day);
                  const isSameMonth = date.getMonth() === day.getMonth();
                  return (
                    <TouchableOpacity
                      onPress={() => setState('date', day)}
                      key={day.getTime()}
                      style={styles.dateView}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: isSame ? COLOR.main1 : 'white',
                        }}
                      >
                        <Text
                          style={[
                            styles.dateText,
                            {
                              opacity: isSameMonth ? 1 : 0.3,
                              color: isSame ? 'white' : COLOR.sub2,
                            },
                          ]}
                        >
                          {day.getDate()}
                        </Text>
                      </View>
                      {isSameMonth && dayRequestShiftLists[day.getDate() - 1] && (
                        <View style={{ flexDirection: 'row' }}>
                          {dayRequestShiftLists[day.getDate() - 1].map((request) => (
                            <View
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 10,
                                margin: 1,
                                backgroundColor: `#${request.shift?.color}`,
                              }}
                            />
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <View style={styles.membersShift}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 24,
                  marginVertical: 16,
                  alignItems: 'flex-end',
                }}
              >
                <Text style={{ fontFamily: 'Apple500', fontSize: 20, color: COLOR.sub1 }}>
                  {date.getMonth() + 1}월 {date.getDate()}일, {days[date.getDay()]}
                </Text>
                <Text style={{ color: COLOR.sub3, fontFamily: 'Apple', fontSize: 14 }}>
                  신청 근무 현황
                </Text>
              </View>
              {dayRequestShiftLists[date.getDate() - 1] &&
                dayRequestShiftLists[date.getDate() - 1].map((member) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 24,
                        paddingVertical: 11,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          source={{
                            uri: `data:image/png;base64,${member.profileImgBase64}`,
                          }}
                          style={{ width: 24, height: 24, borderRadius: 100 }}
                        />
                        <Text
                          style={{
                            marginLeft: 8,
                            fontFamily: 'Apple500',
                            fontSize: 16,
                            color: COLOR.sub2,
                          }}
                        >
                          {member.name}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.shiftBox,
                          {
                            backgroundColor: `#${member.shift?.color}`,
                          },
                        ]}
                      >
                        <Text style={styles.shoftName}>{member.shift?.shortName}</Text>
                        <Text numberOfLines={1} style={styles.name}>
                          {member.shift?.name}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        </SafeAreaView>
        <NavigationBar page="ward" />
      </BottomSheetModalProvider>
      {(isMemberListLoading || isRequestShiftListLoading) && <LottieLoading />}
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  calendarHeaderView: {
    marginTop: 8,
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
  dateView: { flex: 1, height: 67, alignItems: 'center' },
  dateText: {
    fontFamily: 'Poppins500',
    fontSize: 12,
  },
  weekView: { flexDirection: 'row' },
  membersShift: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    shadowColor: 'rgba(210, 199, 231, 0.50)',
    shadowOpacity: 1,
    shadowRadius: 22,
    paddingBottom: 50,
  },
  shiftBox: {
    flexDirection: 'row',
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 4,
  },
  shoftName: {
    fontSize: 14,
    fontFamily: 'Apple500',
    color: 'white',
  },
  name: {
    marginLeft: 5,
    fontFamily: 'Apple500',
    fontSize: 10,
    color: 'white',
  },
});

export default RequestWardShiftPage;
