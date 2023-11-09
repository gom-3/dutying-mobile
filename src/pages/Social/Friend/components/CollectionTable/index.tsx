import { getFriendCollection } from '@libs/api/friend';
import { days, getCurrentWeekIndex, isSameDate } from '@libs/utils/date';
import { useQuery } from '@tanstack/react-query';
import { COLOR } from 'index.style';
import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useCaledarDateStore } from 'store/calendar';
import { useFriendStore } from '../../store';

const CollectionTable = () => {
  const [date] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [weeks] = useFriendStore((state) => [state.weeks]);
  const year = date.getFullYear();
  const month = date.getMonth();
  const currentWeek = getCurrentWeekIndex(date, weeks);
  const { data: collection } = useQuery(['getFriendCollection', year, month], () =>
    getFriendCollection(year, month),
  );

  const sortedCollection = useMemo(() => {
    return collection?.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [collection]);

  const week = useMemo(() => {
    return weeks.filter((_, i) => i === currentWeek)[0];
  }, [date, weeks]);

  return (
    <View>
      <View style={styles.week}>
        <View style={styles.weekDateWrapper} />
        {week
          ? week.map((day, j) => {
              const isToday = isSameDate(new Date(), day);
              return (
                <View
                  key={currentWeek * 7 + j}
                  style={[styles.weekDate, { backgroundColor: isToday ? COLOR.main1 : COLOR.sub5 }]}
                >
                  <Text
                    style={[
                      styles.weekDateText,
                      {
                        color: isToday
                          ? 'white'
                          : j === 0
                          ? '#ff99aa'
                          : j === 6
                          ? '#8b9bff'
                          : COLOR.sub25,
                      },
                    ]}
                  >
                    {days[j]}
                  </Text>
                  <Text
                    style={{
                      color: isToday ? 'white' : COLOR.sub2,
                      fontFamily: 'Poppins',
                      fontSize: 16,
                      marginTop: 7,
                    }}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              );
            })
          : Array.from({ length: 7 }).map((_, i) => (
              <View
                key={currentWeek * 7 + i}
                style={[styles.weekDate, { backgroundColor: COLOR.sub5, height: 58 }]}
              ></View>
            ))}
      </View>
      <ScrollView>
        {sortedCollection?.map((member, i) => (
          <View key={`member ${member.accountId, i} ${currentWeek}`} style={styles.memberView}>
            <View style={styles.memberName}>
              <Text numberOfLines={1} style={styles.memberNameText}>
                {member.name}
              </Text>
              {member.isFavorite && (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 6,
                    height: 6,
                    backgroundColor: COLOR.main1,
                    borderRadius: 10,
                  }}
                />
              )}
            </View>
            {[0, 1, 2, 3, 4, 5, 6].map((j) => {
              if (member.accountShiftTypes[currentWeek * 7 + j])
                return (
                  <Text
                    key={`shift ${currentWeek * 7 + j}`}
                    style={[
                      styles.shiftText,
                      { color: `#${member.accountShiftTypes[currentWeek * 7 + j]?.color}` },
                    ]}
                  >
                    {member.accountShiftTypes[currentWeek * 7 + j]?.name}
                  </Text>
                );
              else return <Text key={`shift ${currentWeek * 7 + j}`} style={styles.shiftText} />;
            })}
          </View>
        ))}
        <View style={{ height: 150 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flex: 1,
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  weekDateWrapper: {
    flex: 1,
    margin: 5,
  },
  weekDate: {
    margin: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    height: 58,
    paddingBottom: 6,
    backgroundColor: COLOR.sub5,
    borderRadius: 5,
  },
  weekDateText: { fontFamily: 'Poppins', fontSize: 12 },
});

export default CollectionTable;
