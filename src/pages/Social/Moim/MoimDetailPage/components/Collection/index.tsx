import MonthSelector from '@components/MonthSelector';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import WeekIcon from '@assets/svgs/week-view.svg';
import MonthIcon from '@assets/svgs/month-view.svg';
import { days, getCurrentWeekIndex } from '@libs/utils/date';
import { COLOR } from 'index.style';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MoimCollectionResponseDTO } from '@libs/api/moim';
import { useCaledarDateStore } from 'store/calendar';
import ArrowLeftIcon from '@assets/svgs/arrow-left.svg';
import ArrowRightIcon from '@assets/svgs/arrow-right.svg';

const weekEnum = ['첫째 주', '둘째 주', '셋째 주', '넷째 주', '다섯째 주', '여섯째 주'];

interface Props {
  collection: MoimCollectionResponseDTO | undefined;
}

const Collection = ({ collection }: Props) => {
  const [weeks, initCalendar] = useMoimStore((state) => [state.weeks, state.initCalendar]);
  const [weekView, setWeekView] = useState(false);
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);

  const currentWeek = getCurrentWeekIndex(date, weeks);

  const data = useMemo(
    weekView
      ? () => weeks.filter((_, i) => i === currentWeek).map((week) => ({ week, i: currentWeek }))
      : () => weeks.map((week, i) => ({ week, i })),
    [weekView, date, weeks],
  );

  const year = date.getFullYear();
  const month = date.getMonth();

  const renderItem = useCallback(
    ({ item, index }: { item: { week: Date[]; i: number }; index: number }) => {
      const { week, i } = item;

      return (
        <View>
          <View style={styles.week}>
            <View style={styles.weekDateWrapper} />
            {week.map((day, j) => (
              <View key={i * 7 + j} style={styles.weekDate}>
                <Text
                  style={[
                    styles.weekDateText,
                    {
                      color: j === 0 ? '#ff99aa' : j === 6 ? '#8b9bff' : COLOR.sub25,
                    },
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>
            ))}
          </View>
          {collection?.memberViews.map((member) => (
            <View key={`member ${member.accountId} ${i}`} style={styles.memberView}>
              <View style={styles.memberName}>
                <Text style={styles.memberNameText}>{member.name}</Text>
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
                      {member.accountShiftTypes[i * 7 + j]?.name}
                    </Text>
                  );
                else return <Text key={`shift ${i * 7 + j}`} style={styles.shiftText} />;
              })}
            </View>
          ))}
        </View>
      );
    },
    [weekView, date],
  );

  useEffect(() => {
    initCalendar(year, month);
  }, [year, month]);

  return (
    <View>
      <View
        style={{
          paddingHorizontal: 26,
          paddingTop: 16,
          paddingBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <MonthSelector />
        <TouchableOpacity onPress={() => setWeekView(!weekView)}>
          {!weekView ? <WeekIcon /> : <MonthIcon />}
        </TouchableOpacity>
      </View>
      {weekView && (
        <View style={styles.weekNumber}>
          <Text style={styles.weekNumberText}>{weekEnum[currentWeek]}</Text>
          <TouchableOpacity
            onPress={() =>
              setState('date', new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7))
            }
          >
            <ArrowLeftIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setState('date', new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7))
            }
          >
            <ArrowRightIcon />
          </TouchableOpacity>
        </View>
      )}
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
      <FlatList
        ListFooterComponent={
          weekView ? <View style={{ height: 520 }} /> : <View style={{ height: 450 }} />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `week ${item.i}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shiftText: {
    fontFamily: 'Apple',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  weekNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
  },
  weekNumberText: {
    color: COLOR.main1,
    fontSize: 14,
    fontFamily: 'Apple500',
  },
  week: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: COLOR.sub5,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  weekDateWrapper: {
    flex: 1,
  },
  weekDate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDateText: { fontFamily: 'Poppins', fontSize: 12 },
  memberView: { flexDirection: 'row', flex: 1, padding: 10, alignItems: 'center' },
  memberName: { flex: 1 },
  memberNameText: {
    fontSize: 12,
    fontFamily: 'Apple500',
    color: COLOR.sub1,
    textAlign: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: COLOR.main4,
    borderRadius: 3,
  },
});

export default Collection;
