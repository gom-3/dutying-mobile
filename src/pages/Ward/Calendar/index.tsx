import PageViewContainer from '@components/PageView';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrevButton from '@assets/svgs/arrow-left.svg';
import NextButton from '@assets/svgs/arrow-right.svg';
import HumanIcon from '@assets/svgs/human.svg';
import NavigationBar from '@components/NavigationBar';
import { COLOR, screenWidth } from 'index.style';
import { days } from '@libs/utils/date';
import { useQuery } from '@tanstack/react-query';
import { useCaledarDateStore } from 'store/calendar';
import { getFriendCollection } from '@libs/api/friend';
import { useMemo } from 'react';
import WardHeader from '../components/WardHeader';

const WardCalendarPage = () => {
  const [date] = useCaledarDateStore((state) => [state.date]);
  const { data: collection } = useQuery(['getTestCollection', date.getMonth()], () =>
    getFriendCollection(date.getFullYear(), date.getMonth()),
  );
  const dates = useMemo(() => {
    return Array.from(
      { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
      (_, i) => i + 1,
    );
  }, [date.getFullYear(), date.getMonth()]);
  console.log(collection);
  return (
    <PageViewContainer>
      <SafeAreaView>
        <WardHeader tab="calendar" />
        <ScrollView style={{ paddingTop: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 24 }}>
            <Text style={{ color: COLOR.main1, fontFamily: 'Apple500', fontSize: 16 }}>
              7월 둘째 주
            </Text>
            <TouchableOpacity>
              <PrevButton />
            </TouchableOpacity>
            <TouchableOpacity>
              <NextButton />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
            {days.map((day, i) => (
              <TouchableOpacity key={day} style={styles.dayCard}>
                <Text
                  style={[
                    styles.dayCardText,
                    { color: i === 0 ? '#FF99AA' : i === 6 ? '#8B9BFF' : COLOR.sub25 },
                  ]}
                >
                  {day}
                </Text>
                <Text style={styles.dayCardDateText}>{i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            style={{ paddingLeft: 24, paddingTop: 24, paddingBottom: 42 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {['D', 'E', 'N', 'O'].map((shift) => (
              <View
                key={shift}
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
                      backgroundColor: '#4dc2ad',
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'Apple', fontSize: 14, color: 'white' }}>
                      {shift}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <HumanIcon />
                    <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: COLOR.sub3 }}>
                      4
                    </Text>
                  </View>
                </View>
                {['조성연', '김범진', '황인서', '김수정'].map((nurse) => (
                  <Text
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
              <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={{ flexDirection: 'row', height: 24, backgroundColor: COLOR.sub5 }}>
                    {dates.map((day) => (
                      <View
                        style={{
                          width: (screenWidth * 0.83) / 7,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text>{day}</Text>
                      </View>
                    ))}
                  </View>
                  {collection?.map((member) => (
                    <View
                      key={`member ${member.accountId}`}
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
                              key={`shift ${j}`}
                              style={[
                                styles.shiftText,
                                { color: `#${member.accountShiftTypes[j]?.color}` },
                              ]}
                            >
                              {member.accountShiftTypes[j]?.name}
                            </Text>
                          );
                        else return <Text key={`shift ${j}`} style={styles.shiftText} />;
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
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  dayCard: {
    margin: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: COLOR.sub5,
    borderRadius: 5,
  },
  dayCardText: {
    fontSize: 10,
    fontFamily: 'Apple',
  },
  dayCardDateText: {
    color: COLOR.sub2,
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
