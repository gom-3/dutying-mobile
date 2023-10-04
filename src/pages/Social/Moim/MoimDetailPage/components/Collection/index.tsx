import MonthSelector from '@components/MonthSelector';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import WeekIcon from '@assets/svgs/week-view.svg';
import MonthIcon from '@assets/svgs/month-view.svg';
import { days } from '@libs/utils/date';
import { COLOR } from 'index.style';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useEffect, useState } from 'react';
import { MoimCollectionResponseDTO } from '@libs/api/moim';
import { useCaledarDateStore } from 'store/calendar';

interface Props {
  collection: MoimCollectionResponseDTO;
}

const Collection = ({ collection }: Props) => {
  const [weeks, initCalendar] = useMoimStore((state) => [state.weeks, state.initCalendar]);
  const [weekView, setWeekView] = useState(false);
  const [date] = useCaledarDateStore((state) => [state.date]);

  useEffect(() => {
    initCalendar(date.getFullYear(), date.getMonth());
  }, [date.getFullYear(), date.getMonth()]);

  return (
    <ScrollView>
      <View
        style={{
          paddingHorizontal: 26,
          paddingVertical: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <MonthSelector />
        <TouchableOpacity onPress={() => setWeekView(!weekView)}>
          {!weekView ? <WeekIcon /> : <MonthIcon />}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 10, paddingBottom: 8 }}>
        <View style={{ flex: 1 }} />
        {days.map((day) => (
          <View key={day} style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'Apple',
                fontSize: 10,
                color: day === '일' ? '#ff99aa' : day === '토' ? '#8b9bff' : COLOR.sub25,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
      {weeks.length > 0 &&
        weeks.map((week, i) => {
          return (
            <View key={`week ${i}`}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  backgroundColor: COLOR.sub5,
                  paddingVertical: 3,
                  paddingHorizontal: 10,
                }}
              >
                <View style={{ flex: 1 }} />
                {week.map((day, j) => (
                  <View
                    key={i * 7 + j}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        color: j === 0 ? '#ff99aa' : j === 6 ? '#8b9bff' : COLOR.sub25,
                      }}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                ))}
              </View>
              {collection.memberViews.map((member) => (
                <View
                  key={`member ${i}`}
                  style={{ flexDirection: 'row', flex: 1, padding: 10, alignItems: 'center' }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Apple500',
                        color: COLOR.sub1,
                        textAlign: 'center',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        backgroundColor: COLOR.main4,
                        borderRadius: 3,
                      }}
                    >
                      {member.name}
                    </Text>
                  </View>
                  {[0, 1, 2, 3, 4, 5, 6].map((j) => {
                    if (member.accountShiftTypes[i * 7 + j])
                      return (
                        <Text
                          key={`shift ${i * 7 + j}`}
                          style={[
                            styles.shiftText,
                            { color: `#${member.accountShiftTypes[i * 7 + j].color}` },
                          ]}
                        >
                          {member.accountShiftTypes[i * 7 + j] &&
                            member.accountShiftTypes[i * 7 + j].name}
                        </Text>
                      );
                    else return <Text key={`shift ${i * 7 + j}`} style={styles.shiftText} />;
                  })}
                </View>
              ))}
            </View>
          );
        })}
      <View style={{ height: 200, backgroundColor: 'white' }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shiftText: {
    fontFamily: 'Apple',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
});

export default Collection;
