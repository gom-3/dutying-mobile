import MonthSelector from '@components/MonthSelector';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import WeekIcon from '@assets/svgs/week-view.svg';
import MonthIcon from '@assets/svgs/month-view.svg';
import { days } from '@libs/utils/date';
import { COLOR } from 'index.style';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useState } from 'react';
import { collections } from '@mocks/social';

interface Props {
  isVisible: boolean;
}

const Collection = ({ isVisible }: Props) => {
  const [weeks, initCalendar] = useMoimStore((state) => [state.weeks, state.initCalendar]);
  const [weekView, setWeekView] = useState(false);

  if (!isVisible && weeks.length === 0) return;

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
          <View style={{ flex: 1, alignItems: 'center' }}>
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
      {weeks.map((week) => {
        return (
          <View>
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
              {week.map((day, i) => (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: i === 0 ? '#ff99aa' : i === 6 ? '#8b9bff' : COLOR.sub25,
                    }}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              ))}
            </View>
            {collections.map((collection) => (
              <View style={{ flexDirection: 'row', flex: 1, padding: 10, alignItems: 'center' }}>
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
                    {collection.name}
                  </Text>
                </View>
                <Text style={styles.shiftText}>나이트</Text>
                <Text style={styles.shiftText}>나이트</Text>
                <Text style={styles.shiftText}>나이트</Text>
                <Text style={styles.shiftText}>나이트</Text>
                <Text style={styles.shiftText}>나이트</Text>
                <Text style={styles.shiftText}>나이트</Text>
                <Text style={styles.shiftText}>나이트</Text>
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
    color: '#3580ff',
  },
});

export default Collection;
