import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '@assets/svgs/check.svg';
import MonthSelector from '@components/MonthSelector';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { dateToString, days, isSameDate } from '@libs/utils/date';
import { COLOR } from 'index.style';
import { useEffect, useMemo, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import TrashIcon from '@assets/svgs/trash-color.svg';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  WardReqShift,
  WardUser,
  getWardMembers,
  getWardShiftRequest,
  requestRequestShiftList,
} from '@libs/api/ward';
import { useAccountStore } from 'store/account';
import { wardKeys } from '@libs/api/queryKey';
import { getDayRequestShiftLists } from '..';
import { useShiftTypeStore } from 'store/shift';
import Shift from '@components/Shift';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LottieLoading from '@components/LottieLoading';

const RequestShift = () => {
  const [account] = useAccountStore((state) => [state.account]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [requestArray, setRequestArray] = useState<Map<string, number | null>>(new Map());
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const navigation = useNavigation();
  const year = date.getFullYear();
  const month = date.getMonth();
  const queryClient = useQueryClient();

  const { mutate: requestShiftListMutate } = useMutation(
    (wardReqShifts: WardReqShift[]) =>
      requestRequestShiftList(account.wardId, {
        year,
        month: month + 1,
        wardReqShifts: wardReqShifts,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          wardKeys.requestList(account.wardId, account.shiftTeamId, year, month),
        );
        queryClient.refetchQueries(
          wardKeys.requestList(account.wardId, account.shiftTeamId, year, month),
        );
        navigation.goBack();
        Toast.show({
          type: 'success',
          text1: '신청근무가 수정되었습니다.',
        });
      },
    },
  );

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

  /** 신청 근무 목록 */
  const { data: requestShiftList, isLoading: isRequestShiftListLoading } = useQuery(
    wardKeys.requestList(account.wardId, account.shiftTeamId, year, month),
    () => getWardShiftRequest(account.wardId, account.shiftTeamId, year, month),
    {
      enabled: !!linkedMemberList && linkedMemberListMap.size > 0,
    },
  );
  // 날짜별
  const dayRequestShiftLists = useMemo(() => {
    return getDayRequestShiftLists(requestShiftList, date, linkedMemberListMap);
  }, [requestShiftList]);

  // 내 신청 근무 중 아직 확정안된 근무
  useEffect(() => {
    if (requestShiftList) {
      const my = requestShiftList.find((v) => v.accountId === account.accountId);
      console.log(my, 123);
      const newMap = new Map(requestArray);
      my?.accountShiftTypes.forEach((shift, i) => {
        if (shift && !shift.isAccepted) {
          const dateString = dateToString(new Date(date.getFullYear(), date.getMonth(), i + 1));
          newMap.set(dateString, shift.accountShiftTypeId);
        }
      });
      setRequestArray(newMap);
      console.log(newMap);
    }
  }, [requestShiftList]);

  console.log(shiftTypes);
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

  const insertShift = (requestDate: Date, shiftId: number) => {
    const newMap = new Map(requestArray);
    const dateString = dateToString(requestDate);
    newMap.set(dateString, shiftId);
    setRequestArray(newMap);
  };

  const deleteShift = (requestDate: Date) => {
    const newMap = new Map(requestArray);
    const dateString = dateToString(requestDate);
    newMap.set(dateString, null);
    setRequestArray(newMap);
  };

  const shiftTypeButtons = useMemo(() => {
    const array: (Shift | null)[] = Array.from(shiftTypes.values());
    const result: (Shift | null)[][] = [];

    for (let i = 0; i < array.length; i += 4) {
      let chunk = array.slice(i, i + 4);
      if (chunk.length < 4)
        chunk = chunk.concat(Array.from({ length: 4 - chunk.length }, () => null));
      result.push(chunk);
    }
    return result;
  }, []);

  const [selectedTab, setSelectedTab] = useState<'request' | 'list'>('request');

  const saveRequestShift = () => {
    const array: WardReqShift[] = [];
    if (requestArray.size === 0) return;
    requestArray.forEach((value, key) => {
      array.push({ date: key, accountShiftTypeId: value });
    });
    console.log(array);
    requestShiftListMutate(array);
  };

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader
            title="근무 신청하기"
            rightItems={
              <TouchableOpacity onPress={saveRequestShift}>
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
                        {isSameMonth && dayRequestShiftLists[day.date.getDate() - 1] && (
                          <View style={{ flexDirection: 'row', marginLeft: 5, height: 8 }}>
                            {dayRequestShiftLists[day.date.getDate() - 1].map((request) => (
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
                        <Shift
                          isWardRequest
                          date={day.date.getDate()}
                          shift={
                            requestArray.get(dateToString(day.date)) !== null
                              ? shiftTypes.get(requestArray.get(dateToString(day.date)) || 0)
                              : undefined
                          }
                          isCurrent={isSameMonth}
                          isToday={isSame}
                          fullNameVisibilty
                        />
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
                    onPress={() => deleteShift(date)}
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
                {shiftTypeButtons.map((shiftTypeList, i) => {
                  return (
                    <View
                      key={shiftTypeList[0]?.accountShiftTypeId + `${i}`}
                      style={styles.registShiftItemsView}
                    >
                      {shiftTypeList.map((shift) => {
                        if (shift)
                          return (
                            <TouchableOpacity
                              activeOpacity={0.7}
                              key={shift.accountShiftTypeId}
                              onPress={() => insertShift(date, shift.accountShiftTypeId)}
                              style={styles.shiftItemView}
                            >
                              <View style={[styles.shiftView, { backgroundColor: shift.color }]}>
                                <Text style={styles.shiftShortNameText}>{shift.shortName}</Text>
                                <Text style={styles.shiftFullNameText}>{shift.name}</Text>
                              </View>
                            </TouchableOpacity>
                          );
                        else return <View style={styles.shiftItemView} />;
                      })}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={{ marginTop: 10 }}>
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
                              uri: `data:image/png;base64,${member.profileImgBase64})
                              ?.profileImgBase64}`,
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
            )}
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
      {(isMemberListLoading || isRequestShiftListLoading) && <LottieLoading />}
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
  registShiftItemsView: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-start',
  },
});

export default RequestShift;
