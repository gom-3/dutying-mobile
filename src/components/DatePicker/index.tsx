import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { COLOR } from 'index.style';

interface Props {
  date: Date;
  onChange: (_: DateTimePickerEvent, selectedDate: Date | undefined) => void;
  mode: 'date' | 'time';
  text?: string;
  style?: StyleProp<ViewStyle>;
}

const DatePicker = ({ date, mode, text, style, onChange }: Props) => {
  const ref = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  const onPressTime = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (_, selectedDate) => onChange(_, selectedDate),
        mode,
      });
    } else {
      ref.current?.present();
    }
  };

  return (
    <View>
      <Pressable style={style} onPress={onPressTime}>
        <Text style={styles.usingItemTitle}>{text}</Text>
        <View style={styles.usingItemWrapper}>
          <Text style={styles.usingItemText}>
            {mode === 'date'
              ? `${date.getMonth() + 1}월 ${date.getDate()}일`
              : `${date.getHours().toString().padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
          </Text>
        </View>
      </Pressable>
      {Platform.OS === 'ios' && (
        <BottomSheetModal
          ref={ref}
          index={1}
          snapPoints={[100, 300]}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          onChange={(index) => {
            if (index !== 1) ref.current?.close();
          }}
        >
          <DateTimePicker mode={mode} display="spinner" value={date} onChange={onChange} />
        </BottomSheetModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  usingItemTitle: { fontFamily: 'Apple', fontSize: 10, color: COLOR.sub3 },
  usingItemWrapper: { flexDirection: 'row' },
  usingItemText: {
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    color: COLOR.sub1,
    paddingVertical: 4,
  },
});

export default DatePicker;
