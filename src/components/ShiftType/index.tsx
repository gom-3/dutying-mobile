import { View, Text, Pressable } from 'react-native';

interface Props {
  shift: Shift;
  isTimeVisible?: boolean;
}

const ShiftType = ({ shift }: Props) => {
  // return (
  //   <View style={styles.shift}>
  //     <View style={[styles.shiftBox, { backgroundColor: shiftType.color }]}>
  //       <Text style={styles.shoftName}>{shiftType.shortName}</Text>
  //       <Text style={styles.name}>{shiftType.name}</Text>
  //     </View>
  //     <Text style={styles.time}>{`${shiftType.startTime?.getHours()}:${shiftType.startTime
  //       ?.getMinutes()
  //       .toString()
  //       .padStart(2, '0')}-${shiftType.endTime?.getHours()}:${shiftType.endTime
  //       ?.getMinutes()
  //       .toString()
  //       .padStart(2, '0')}`}</Text>
  //   </View>
  // );
};

export default ShiftType;
