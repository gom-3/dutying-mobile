import MonthSelector from '@components/MonthSelector';
import { days, isSameDate } from '@libs/utils/date';
import { COLOR, screenWidth } from 'index.style';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Image,
} from 'react-native';
import MoimShift from './Shift';
import Carousel from 'react-native-snap-carousel';
import useSummary from './index.hook';

const datas = [8, 13, 23];

interface Props {
  isVisible: boolean;
}

const Summary = ({ isVisible }: Props) => {
  const {
    states: { date, shiftTypes, page, selectedShiftType, account, weeks, threeDates },
    actions: { pressShiftTypeHandler, setPage, setState },
  } = useSummary();

  const renderItem = ({ item }: { item: number }) => {
    return (
      <View style={styles.card} key={`card${item}`}>
        <View style={styles.cardContent}>
          <Text style={styles.cardHeaderText}>가장 많이 겹치는 오프</Text>
          <Text style={styles.cardNumberText}>4/4</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardDateText}>7월 {item}일 수</Text>
          <View style={styles.cardNames}>
            <View style={styles.cardName}>
              <Text style={styles.cardNameText}>조성연</Text>
            </View>
            <View style={styles.cardName}>
              <Text style={styles.cardNameText}>조성연</Text>
            </View>
            <View style={styles.cardName}>
              <Text style={styles.cardNameText}>조성연</Text>
            </View>
            <View style={styles.cardName}>
              <Text style={styles.cardNameText}>조성연</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!isVisible || weeks.length === 0) return;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 0.5 }}>
          <MonthSelector />
        </View>
        <ScrollView horizontal style={styles.shiftTypes} showsHorizontalScrollIndicator={false}>
          {Array.from(shiftTypes.values()).map((type) => (
            <TouchableOpacity
              key={`shiftType${type.accountShiftTypeId}`}
              activeOpacity={0.7}
              style={[
                styles.shiftType,
                {
                  backgroundColor:
                    selectedShiftType === type.accountShiftTypeId ? COLOR.main4 : 'white',
                  borderColor:
                    selectedShiftType === type.accountShiftTypeId ? COLOR.main1 : COLOR.main2,
                },
              ]}
              onPress={() => pressShiftTypeHandler(type.accountShiftTypeId)}
            >
              <Text
                style={[
                  styles.shiftTypeText,
                  {
                    color:
                      selectedShiftType === type.accountShiftTypeId ? COLOR.main1 : COLOR.main2,
                  },
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Carousel
        onSnapToItem={(index) => setPage(index)}
        firstItem={page}
        data={datas}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.8}
        enableMomentum={true}
        decelerationRate={0.3}
      />
      <View>
        <View style={styles.days}>
          {days.map((day) => (
            <View style={styles.day} key={day}>
              <Text
                style={[
                  styles.dayText,
                  {
                    color: day === '일' ? '#ff99aa' : day === '토' ? '#8b9bff' : COLOR.sub25,
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        {weeks.map((week, i) => (
          <View key={`week${i}`} style={styles.week}>
            {week.map((day) => {
              const isToday = isSameDate(date, day);
              return (
                <TouchableOpacity
                  onPress={() => setState('date', day)}
                  key={`${day.getMonth()}.${day.getDate()}`}
                  style={styles.dateWrapper}
                >
                  <View
                    style={[
                      styles.date,
                      {
                        backgroundColor: isToday ? COLOR.sub3 : COLOR.bg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color:
                            day.getMonth() === date.getMonth()
                              ? isToday
                                ? 'white'
                                : COLOR.sub2
                              : COLOR.sub4,
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.membersShift}>
        <Text style={styles.membersShiftDate}>
          {date.getMonth() + 1}월 {date.getDate()}일, {days[date.getDay()]}
        </Text>
        <View style={styles.memberShiftDateList}>
          <Text style={styles.memberShiftDateBlur}>
            {threeDates[0].getMonth() + 1}월 {threeDates[0].getDate()}일
          </Text>
          <Text style={styles.memberShiftDateFoucs}>
            {threeDates[1].getMonth() + 1}월 {threeDates[1].getDate()}일
          </Text>
          <Text style={styles.memberShiftDateBlur}>
            {threeDates[2].getMonth() + 1}월 {threeDates[2].getDate()}일
          </Text>
        </View>
        {[1, 2, 3, 4].map((a) => (
          <View key={`name ${a}`} style={styles.member}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.memberProfile}
                source={{ uri: `data:image/png;base64,${account.profileImgBase64}` }}
              />
              <Text style={styles.memberName}>김찬규</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MoimShift shiftTypeId={selectedShiftType} />
              <MoimShift shiftTypeId={selectedShiftType} isToday />
              <MoimShift shiftTypeId={selectedShiftType} />
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 200, backgroundColor: 'white' }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftTypes: {
    flex: 2,
    flexDirection: 'row',
  },
  shiftType: {
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 5,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  shiftTypeText: {
    fontFamily: 'Apple500',
    fontSize: 12,
  },
  cardScroll: {
    width: screenWidth,
    marginLeft: 8,
  },
  card: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderColor: COLOR.main4,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 32,
    width: screenWidth - 80,
    shadowColor: Platform.OS === 'android' ? '#b497ee' : '#ede9f5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContent: {
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNames: {
    flexDirection: 'row',
  },
  cardName: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 20,
    backgroundColor: COLOR.main4,
    marginLeft: 3,
  },
  cardNameText: {
    fontFamily: 'Apple',
    fontSize: 8,
    color: COLOR.sub2,
  },
  cardHeaderText: {
    color: COLOR.sub2,
    fontFamily: 'Apple',
    fontSize: 10,
  },
  cardNumberText: {
    color: COLOR.sub25,
    fontFamily: 'Poppins',
    fontSize: 10,
  },
  cardDateText: {
    fontFamily: 'Apple600',
    fontSize: 20,
    color: COLOR.sub1,
  },
  shiftBox: {
    flexDirection: 'row',
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderRadius: 7,
    marginLeft: 4,
  },
  shoftName: {
    fontSize: 14,
    fontFamily: 'Poppins500',
    color: 'white',
  },
  name: {
    fontFamily: 'Apple500',
    fontSize: 10,
    color: 'white',
  },
  days: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.sub4,
    paddingBottom: 8,
  },
  day: { flex: 1, alignItems: 'center' },
  dayText: { fontFamily: 'Apple', fontSize: 12 },
  week: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 24,
    height: 55,
    marginTop: 2,
  },
  dateWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  date: {
    width: 26,
    height: 26,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Apple500',
    fontSize: 12,
  },
  membersShift: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    shadowColor: 'rgba(210, 199, 231, 0.50)',
    shadowOpacity: 1,
    shadowRadius: 22,
  },
  membersShiftDate: {
    marginTop: 16,
    marginLeft: 24,
    fontFamily: 'Apple500',
    fontSize: 20,
    color: COLOR.sub1,
  },
  memberShiftDateList: { flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 24 },
  memberShiftDateFoucs: {
    width: 58,
    fontFamily: 'Apple600',
    color: COLOR.sub2,
    fontSize: 10,
    textAlign: 'center',
  },
  memberShiftDateBlur: {
    width: 58,
    fontFamily: 'Apple500',
    color: COLOR.sub3,
    fontSize: 10,
    textAlign: 'center',
  },
  member: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomColor: COLOR.sub45,
    borderBottomWidth: 0.5,
  },
  memberProfile: { width: 24, height: 24, marginRight: 8 },
  memberName: { color: COLOR.sub2, fontFamily: 'Apple500', fontSize: 16 },
});

export default Summary;
