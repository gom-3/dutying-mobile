import { getFriendsTodayShifts } from '@libs/api/friend';
import { useQuery } from '@tanstack/react-query';
import { COLOR } from 'index.style';
import { ScrollView, View, Text } from 'react-native';

const TodayShift = () => {
  const { data: todayShifts } = useQuery(['getFriendTodayShift'], () => getFriendsTodayShifts());
  if (todayShifts) console.log(todayShifts[1].accountShiftTypes);
  return (
    <ScrollView style={{ marginLeft: 24 }} horizontal showsHorizontalScrollIndicator={false}>
      {todayShifts?.map((shift) => {
        if (!shift.accountShiftTypes[0]) return;
        return (
          <View key={`td-${shift.accountId}`} style={{ marginRight: 14 }}>
            <View
              style={{
                backgroundColor: `#${shift.accountShiftTypes[0].color}`,
                width: 42,
                height: 42,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Apple', color: 'white', fontSize: 30 }}>
                {shift.accountShiftTypes[0].shortName}
              </Text>
            </View>
            <Text
              style={{
                marginTop: 4,
                color: COLOR.sub1,
                fontSize: 12,
                fontFamily: 'Apple',
                textAlign: 'center',
              }}
            >
              {shift.name}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default TodayShift;
