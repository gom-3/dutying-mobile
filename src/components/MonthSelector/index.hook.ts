import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRef } from 'react';
import { Platform } from 'react-native';
import { useCaledarDateStore } from 'store/calendar';

const useMonthSelector = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const ref = useRef<BottomSheetModal>(null);

  const onChangeDate = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setState('date', selectedDate);
  };

  const onPressMonthSelector = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (_, selectedDate) => onChangeDate(_, selectedDate),
        mode: 'date',
        display:'spinner',
      });
    } else {
      ref.current?.present();
    }
  };

  return { states: { date, ref }, actions: { onChangeDate, onPressMonthSelector } };
};

export default useMonthSelector;
