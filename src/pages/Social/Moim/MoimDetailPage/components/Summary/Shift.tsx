import { hexToRgba } from '@libs/utils/color';
import { COLOR } from 'index.style';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  isToday?: boolean;
  shift:
    | (Pick<Shift, 'color' | 'name' | 'shortName'> & {
        startTime: string | null;
        endTime: string | null;
      })
    | null;
}

const MoimShift = ({ isToday, shift }: Props) => {
  const [isPressed, setIsPressed] = useState(false);

  if (!shift) return <View style={styles.shiftBox} />;
  // return;

  return (
    <Pressable onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)}>
      <View
        style={[
          styles.shiftBox,
          {
            backgroundColor: isToday ? `#${shift.color}` : hexToRgba(`#${shift.color}`, 0.45),
          },
        ]}
      >
        <Text style={styles.shoftName}>{shift.shortName}</Text>
        <Text numberOfLines={1} style={styles.name}>
          {shift.name}
        </Text>
      </View>
      {isPressed && shift.startTime && shift.endTime && (
        <View
          style={{
            position: 'absolute',
            width: 60,
            top: -18,
            left: '50%',
            transform: [{ translateX: -28 }],
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 3,
            shadowColor: '#9c9c9c',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: COLOR.sub25,
              fontFamily: 'Apple',
              fontSize: 9,
            }}
          >
            {shift.startTime.slice(0, 5)}~{shift.endTime.slice(0, 5)}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shiftBox: {
    flexDirection: 'row',
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 7,
    marginLeft: 4,
  },
  shoftName: {
    fontSize: 14,
    fontFamily: 'Apple500',
    color: 'white',
  },
  name: {
    marginLeft: 5,
    fontFamily: 'Apple500',
    fontSize: 10,
    color: 'white',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
});

export default MoimShift;
