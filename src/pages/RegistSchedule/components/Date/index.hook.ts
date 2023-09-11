import { useState } from 'react';
import { Platform } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';

const useDate = () => {
  const [using, setUsing] = useState(false);
  const [startDate, endDate, setState] = useScheduleStore((state) => [
    state.startDate,
    state.endDate,
    state.setState,
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'time' | 'date'>('date');
  const [value, setValue] = useState(startDate);
  const [dateString, setDateString] = useState<'startDate' | 'endDate'>('startDate');

  const onChangeStartTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setState('startDate', selectedDate);
  };

  const onChangeEndTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setState('endDate', selectedDate);
  };

  const onChangeAndroid = (selectedDate: Date | undefined, dateString: 'startDate' | 'endDate') => {
    setState(dateString, selectedDate);
    if (dateString === 'endDate') {
      if (selectedDate && selectedDate < startDate) {
        setState('startDate', selectedDate);
      }
    }
    if (dateString === 'startDate') {
      if (selectedDate && selectedDate > endDate) {
        setState('endDate', selectedDate);
      }
    }
  };

  const datePressHander = (
    mode: 'time' | 'date',
    value: Date,
    dateString: 'startDate' | 'endDate',
  ) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        onChange: (_, selectedDate) => onChangeAndroid(selectedDate, dateString),
        mode,
      });
    } else {
      setIsOpen(true);
      setMode(mode);
      setValue(value);
    }
    setDateString(dateString);
  };

  return {
    states: { using, startDate, endDate, isOpen, mode, value },
    actions: { setUsing, setIsOpen, datePressHander, onChangeStartTime, onChangeEndTime },
  };
};

export default useDate;
