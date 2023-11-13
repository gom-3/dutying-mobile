import PageViewContainer from '@components/PageView';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HumanIcon from '@assets/svgs/human.svg';
import NavigationBar from '@components/NavigationBar';
import { COLOR, screenWidth } from 'index.style';
import { days } from '@libs/utils/date';
import { useQuery } from '@tanstack/react-query';
import { useCaledarDateStore } from 'store/calendar';
import { useEffect, useMemo, useRef } from 'react';
import WardHeader from '../components/WardHeader';
import MonthSelector from '@components/MonthSelector';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAccountStore } from 'store/account';
import { getWardShiftCollection } from '@libs/api/ward';
import { wardKeys } from '@libs/api/queryKey';
import LottieLoading from '@components/LottieLoading';

type DayShiftNurseListType = Pick<Shift, 'color' | 'shortName'> & { nurses: string[] };
const order = ['DAY', 'EVENING', 'NIGHT', 'OFF'];

// TODO: 로직 분리
const WardCalendarPage = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [account] = useAccountStore((state) => [state.account]);
  const dayShiftRef = useRef<ScrollView>(null);
  const collectionRef = useRef<ScrollView>(null);
  const year = date.getFullYear();
  const month = date.getMonth();
  const { data: collection, isLoading } = useQuery(
    wardKeys.shiftList(account.wardId, account.shiftTeamId, year, month),
    () => getWardShiftCollection(account.wardId, account.shiftTeamId, year, month),
  );
  const dayShiftNurseList = useMemo(() => {
    if (!collection) return [];
    const shifts = new Map<string, DayShiftNurseListType>();
    collection.forEach((member) => {
      const shift = member.accountShiftTypes[date.getDate() - 1];
      if (shift) {
        const key = shift.classification;
        const value = shifts.get(key);
        if (value) shifts.set(key, { ...value, nurses: value.nurses.concat(member.name) });
        else
          shifts.set(key, {
            shortName: shift.shortName,
            color: `#${shift.color}`,
            nurses: [member.name],
          });
      }
    });
    const shiftList = [...shifts].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    return shiftList;
  }, [date, collection]);

  const dates = useMemo(() => {
    return Array.from(
      { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
      (_, i) => i + 1,
    );
  }, [date.getFullYear(), date.getMonth()]);

  useEffect(() => {
    if (dayShiftRef.current) {
      dayShiftRef.current.scrollTo({
        x: (date.getDate() - 1) * (screenWidth / 9.5 + 10),
        animated: true,
      });
    }
    if (collectionRef.current) {
      collectionRef.current.scrollTo({
        x: (date.getDate() - 2) * ((screenWidth * 0.83) / 7),
      });
    }
  }, [date]);

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <WardHeader tab="calendar" />
          <ScrollView style={{ paddingTop: 40 }} contentContainerStyle={{ paddingBottom: 166 }}>
            <MonthSelector style={{ marginLeft: 26, marginBottom: 4 }} isImage={false} />
            <ScrollView
              ref={dayShiftRef}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ flexDirection: 'row', paddingHorizontal: 20 }}
            >
              {dates.map((day, i) => {
                const cardDate = new Date(date.getFullYear(), date.getMonth(), day);
                const cardDay = cardDate.getDay();
                return (
                  <TouchableOpacity
                    onPress={() =>
                      setState('date', new Date(date.getFullYear(), date.getMonth(), i + 1))
                    }
                    key={day}
                    style={[
                      styles.dayCard,
                      { backgroundColor: date.getDate() === i + 1 ? COLOR.main1 : COLOR.sub5 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCardText,
                        {
                          color:
                            date.getDate() === i + 1
                              ? 'white'
                              : cardDay === 0
                              ? '#FF99AA'
                              : cardDay === 6
                              ? '#8B9BFF'
                              : COLOR.sub25,
                        },
                      ]}
                    >
                      {days[cardDay]}
                    </Text>
                    <Text
                      style={[
                        styles.dayCardDateText,
                        { color: date.getDate() === i + 1 ? 'white' : COLOR.sub2 },
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View style={{ width: 50 }} />
            </ScrollView>
            <ScrollView
              style={{ paddingLeft: 24, paddingTop: 12, paddingBottom: 42 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {dayShiftNurseList.map((shift) => (
                <View
                  key={shift[0]}
                  style={{
                    borderColor: COLOR.sub45,
                    borderWidth: 0.5,
                    borderRadius: 10,
                    padding: 6,
                    width: 88,
                    marginRight: 12,
                    shadowColor: '#ede9f5',
                    shadowOpacity: 1,
                    backgroundColor: 'white',
                    shadowOffset: { width: 2, height: 2 },
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: shift[1].color,
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontFamily: 'Apple', fontSize: 14, color: 'white' }}>
                        {shift[1].shortName}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <HumanIcon />
                      <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: COLOR.sub3 }}>
                        {shift[1].nurses.length}
                      </Text>
                    </View>
                  </View>
                  {shift[1].nurses.map((nurse) => (
                    <Text
                      key={nurse}
                      style={{ margin: 6, color: COLOR.sub2, fontSize: 14, fontFamily: 'Apple500' }}
                    >
                      {nurse}
                    </Text>
                  ))}
                </View>
              ))}
            </ScrollView>
            <View style={{ marginHorizontal: 24 }}>
              <View>
                <Text style={{ color: COLOR.sub1, fontFamily: 'Apple600', fontSize: 16 }}>
                  병동 동료들
                </Text>
                <Text style={{ color: COLOR.sub3, fontFamily: 'Apple', fontSize: 10 }}>
                  고정을 통해 즐겨찾는 동료를 설정해보세요
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ width: screenWidth * 0.17 }}>
                <View style={{ backgroundColor: COLOR.sub5, height: 24 }} />
                {collection?.map((member) => (
                  <View
                    key={member.name}
                    style={{ padding: 10, borderBottomColor: COLOR.sub45, borderBottomWidth: 0.5 }}
                  >
                    <View style={styles.memberName}>
                      <Text numberOfLines={1} style={styles.memberNameText}>
                        {member.name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={{ width: screenWidth * 0.83 }}>
                <ScrollView
                  ref={collectionRef}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <View>
                    <View style={{ flexDirection: 'row', height: 24, backgroundColor: COLOR.sub5 }}>
                      {dates.map((day) => {
                        const cardDate = new Date(date.getFullYear(), date.getMonth(), day);
                        const cardDay = cardDate.getDay();
                        return (
                          <View
                            key={`table${day}`}
                            style={{
                              width: (screenWidth * 0.83) / 7,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  cardDay === 0
                                    ? '#FF99AA'
                                    : cardDay === 6
                                    ? '#8B9BFF'
                                    : COLOR.sub2,
                                fontFamily: 'Poppins',
                                fontSize: 14,
                              }}
                            >
                              {day}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    {collection?.map((member) => (
                      <View
                        key={`member ${member.name}`}
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderBottomColor: COLOR.sub45,
                          borderBottomWidth: 0.5,
                        }}
                      >
                        {member.accountShiftTypes.map((_, j) => {
                          if (member.accountShiftTypes[j])
                            return (
                              <Text
                                key={`${member.accountId}shift ${j}`}
                                style={[
                                  styles.shiftText,
                                  { color: `#${member.accountShiftTypes[j]?.color}` },
                                ]}
                              >
                                {member.accountShiftTypes[j]?.name}
                              </Text>
                            );
                          else
                            return (
                              <Text
                                key={`${member.accountId}shift ${j}`}
                                style={styles.shiftText}
                              />
                            );
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <NavigationBar page="ward" />
      </BottomSheetModalProvider>
      {isLoading && <LottieLoading />}
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  dayCard: {
    margin: 5,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 5,
    width: screenWidth / 9.5,
  },
  dayCardText: {
    fontSize: 10,
    fontFamily: 'Apple',
  },
  dayCardDateText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginTop: 7,
  },
  memberView: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomColor: COLOR.main4,
    borderBottomWidth: 0.5,
  },
  memberName: {
    flex: 1,
    borderRadius: 3,
    paddingVertical: 2,
    backgroundColor: COLOR.main4,
  },
  memberNameText: {
    fontSize: 12,
    fontFamily: 'Apple500',
    color: COLOR.sub1,
    textAlign: 'center',
  },
  shiftText: {
    fontFamily: 'Apple',
    fontSize: 12,
    width: (screenWidth * 0.83) / 7,
    textAlign: 'center',
  },
});

export default WardCalendarPage;
