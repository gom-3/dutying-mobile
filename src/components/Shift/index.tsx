import { COLOR } from 'index.style';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  date: number;
  shift: Shift | undefined;
  isCurrent: boolean;
  isToday: boolean;
  fullNameVisibilty: boolean;
  isWardRequest?: boolean;
}

const Shift = ({
  shift,
  date,
  isCurrent,
  isToday,
  fullNameVisibilty,
  isWardRequest = false,
}: Props) => {
  const transparency = isCurrent ? 1 : 0.5;
  const backgroundColor = `${shift?.color}${Math.round(transparency * 255).toString(16)}`;
  return (
    <View
      style={[
        styles.shiftContainer,
        {
          backgroundColor: shift
            ? backgroundColor
            : isToday
            ? isWardRequest
              ? COLOR.main4
              : COLOR.sub5
            : 'white',
          paddingLeft: fullNameVisibilty ? 0 : 8,
          borderWidth: isToday ? 1.5 : 1,
          borderColor: isToday ? COLOR.main1 : !isCurrent ? 'white' : backgroundColor,
          borderRadius: !fullNameVisibilty && isToday ? 50 : 5,
        },
      ]}
    >
      {fullNameVisibilty ? (
        <View style={styles.shiftFullNameView}>
          <Text style={styles.shiftInitialText}>{shift?.shortName}</Text>
          <Text style={styles.shiftFullNameText}>{shift?.name}</Text>
        </View>
      ) : (
        <Text
          style={[
            styles.shiftDateText,
            {
              color: shift ? 'white' : COLOR.sub1,
              opacity: shift ? 1 : isCurrent ? 1 : 0.3,
            },
          ]}
        >
          {date}
        </Text>
      )}
      {!fullNameVisibilty && isToday && <View style={styles.todayDot} />}
      {!fullNameVisibilty && <Text style={styles.shiftShoftNameText}>{shift?.shortName}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  shiftContainer: {
    width: 'auto',
    paddingLeft: 8,
    paddingVertical: 3,
    margin: 1,
    position: 'relative',
  },
  shiftDateText: {
    fontFamily: 'Poppins500',
    fontSize: 12,
    height: 16,
  },
  shiftShoftNameText: { color: 'white', position: 'absolute', top: 3, right: 4, fontSize: 10 },
  shiftFullNameView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  shiftInitialText: { color: 'white', fontFamily: 'Poppins500', fontSize: 14, height: 20 },
  shiftFullNameText: { color: 'white', fontFamily: 'Apple', fontSize: 10 },
  todayDot: {
    backgroundColor: COLOR.main1,
    width: 4,
    height: 4,
    position: 'absolute',
    left: -2,
    top: -2,
    borderRadius: 100,
  },
});

export default Shift;
