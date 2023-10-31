import { useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';

const useTimeHook = () => {
  const [isAllday, startDate, endDate, setState] = useScheduleStore((state) => [
    state.isAllday,
    state.startDate,
    state.endDate,
    state.setState,
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'time' | 'date'>('date');
  const [value, setValue] = useState(startDate);
  const [dateString, setDateString] = useState<'startDate' | 'endDate'>('startDate');

  const changeSwitchHandler = (value:boolean) => {
    setState('isAllday', value);
    Keyboard.dismiss();
  };

  const onChangeStartTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setState('startDate', selectedDate);
    if(selectedDate && selectedDate > endDate){
      setState('endDate', selectedDate);
    }
  };

  const onChangeEndTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setState('endDate', selectedDate);
    if(selectedDate && selectedDate < startDate){
      setState('startDate', selectedDate);
    }
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
    states: { isAllday, startDate, endDate, isOpen, mode, value },
    actions: { changeSwitchHandler, setIsOpen, datePressHander, onChangeStartTime, onChangeEndTime },
  };
};

export default useTimeHook;
