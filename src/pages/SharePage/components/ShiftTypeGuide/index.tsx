import { COLOR } from 'index.style';
import { StyleSheet, Text, View } from 'react-native';
import { useShiftTypeStore } from 'store/shift';

const ShiftTypeGuide = () => {
  const [shfitTypes] = useShiftTypeStore((state) => [state.shiftTypes]);

  return (
    <View style={styles.guideContainer}>
      <Text style={styles.title}>근무 유형별 안내</Text>
      <View style={styles.shiftContainer}>
        {Array.from(shfitTypes.values()).map((shiftType) => (
          <View style={styles.shift}>
            <View style={[styles.shiftBox, { backgroundColor: shiftType.color }]}>
              <Text style={styles.shoftName}>{shiftType.shortName}</Text>
              <Text style={styles.name}>{shiftType.name}</Text>
            </View>
            {shiftType.startTime && (
              <Text style={styles.time}>{`${shiftType.startTime?.getHours()}:${shiftType.startTime
                ?.getMinutes()
                .toString()
                .padStart(2, '0')}-${shiftType.endTime?.getHours()}:${shiftType.endTime
                ?.getMinutes()
                .toString()
                .padStart(2, '0')}`}</Text>
            )}
            {!shiftType.startTime && <Text style={styles.time}>-</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  guideContainer: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  title: {
    color: COLOR.main1,
    fontFamily: 'Apple',
    fontSize: 14,
  },
  shiftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  shift: {
    width: '50%',
    marginTop: 8,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftBox: {
    flexDirection: 'row',
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 10,
  },
  shoftName: {
    fontSize: 14,
    height: 21,
    marginRight: 4,
    fontFamily: 'Poppins500',
    color: 'white',
  },
  name: {
    fontFamily: 'Apple',
    fontSize: 10,
    color: 'white',
  },
  time: {
    color: COLOR.sub1,
    fontFamily: 'Poppins',
    fontSize: 12,
  },
});

export default ShiftTypeGuide;
