import MonthSelector from '@components/MonthSelector';
import { days, isSameDate } from '@libs/utils/date';
import { COLOR, screenWidth } from 'index.style';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Image,
} from 'react-native';
import { useAccountStore } from 'store/account';
import { useCaledarDateStore } from 'store/calendar';
import { useShiftTypeStore } from 'store/shift';
import MoimShift from './Shift';
import Carousel from 'react-native-snap-carousel';

const datas = [8, 13, 23];

interface Props {
  isVisible: boolean;
}

const Summary = ({ isVisible }: Props) => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [selectedShiftType, setSelectedShiftType] = useState<number>(
    shiftTypes.keys().next().value,
  );
  const [page, setPage] = useState(0);
  const [account] = useAccountStore((state) => [state.account]);
  const pressShiftTypeHandler = (id: number) => {
    setSelectedShiftType(id);
  };

  const initCalendar = (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const calendar: Date[] = [];
    for (let i = first.getDay() - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      calendar.push(date);
    }
    for (let i = 1; i <= last.getDate(); i++) {
      const date = new Date(year, month, i);
      calendar.push(date);
    }
    for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
      const date = new Date(year, month + 1, j);
      calendar.push(date);
    }
    const weeks: Date[][] = [];
    while (calendar.length > 0) weeks.push(calendar.splice(0, 7));
    return weeks;
  };

  const threeDates = useMemo(() => {
    const prevDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return [prevDate, date, nextDate];
  }, [date]);

  const weeks = useMemo(() => {
    return initCalendar(date.getFullYear(), date.getMonth());
  }, [date.getFullYear(), date.getMonth()]);

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

  if (!isVisible) return;

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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 24,
            borderBottomWidth: 0.5,
            borderBottomColor: COLOR.sub4,
            paddingBottom: 8,
          }}
        >
          {days.map((day) => (
            <View style={{ flex: 1, alignItems: 'center' }} key={day}>
              <Text
                style={{
                  fontFamily: 'Apple',
                  color: day === '일' ? '#ff99aa' : COLOR.sub25,
                  fontSize: 12,
                }}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        {weeks.map((week, i) => (
          <View
            key={`week${i}`}
            style={{
              flexDirection: 'row',
              flex: 1,
              paddingHorizontal: 24,
              height: 55,
              marginTop: 2,
            }}
          >
            {week.map((day) => {
              const isToday = isSameDate(date, day);
              return (
                <TouchableOpacity
                  onPress={() => setState('date', day)}
                  key={`${day.getMonth()}.${day.getDate()}`}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      backgroundColor: isToday ? COLOR.sub3 : COLOR.bg,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color:
                          day.getMonth() === date.getMonth()
                            ? isToday
                              ? 'white'
                              : COLOR.sub2
                            : COLOR.sub4,
                        fontFamily: 'Apple500',
                        fontSize: 12,
                      }}
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
      <View
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'white',
          shadowColor: 'rgba(210, 199, 231, 0.50)',
          shadowOpacity: 1,
          shadowRadius: 22,
        }}
      >
        <Text
          style={{
            marginTop: 16,
            marginLeft: 24,
            fontFamily: 'Apple500',
            fontSize: 20,
            color: COLOR.sub1,
          }}
        >
          {date.getMonth() + 1}월 {date.getDate()}일, {days[date.getDay()]}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 24 }}>
          <Text
            style={{
              width: 58,
              fontFamily: 'Apple500',
              color: COLOR.sub3,
              fontSize: 10,
              textAlign: 'center',
            }}
          >
            {threeDates[0].getMonth() + 1}월 {threeDates[0].getDate()}일
          </Text>
          <Text
            style={{
              width: 58,
              fontFamily: 'Apple600',
              color: COLOR.sub2,
              fontSize: 10,
              textAlign: 'center',
            }}
          >
            {threeDates[1].getMonth() + 1}월 {threeDates[1].getDate()}일
          </Text>
          <Text
            style={{
              width: 58,
              fontFamily: 'Apple500',
              color: COLOR.sub3,
              fontSize: 10,
              textAlign: 'center',
            }}
          >
            {threeDates[2].getMonth() + 1}월 {threeDates[2].getDate()}일
          </Text>
        </View>
        {[1, 2, 3, 4].map((a) => (
          <View
            key={`name ${a}`}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 24,
              paddingVertical: 13,
              alignItems: 'center',
              borderBottomColor: COLOR.sub45,
              borderBottomWidth: 0.5,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ width: 24, height: 24, marginRight: 8 }}
                source={{ uri: `data:image/png;base64,${account.profileImgBase64}` }}
              />
              <Text style={{ color: COLOR.sub2, fontFamily: 'Apple500', fontSize: 16 }}>
                김찬규
              </Text>
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
    // marginLeft: 16,
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
});

export default Summary;
