import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useEditShiftTypeStore } from '../store';

interface TypeList {
  text: string;
  key: Shift['typeDetail'];
}

const workTypeList: TypeList[] = [
  { text: '데이', key: 'day' },
  { text: '이브닝', key: 'evening' },
  { text: '나이트', key: 'night' },
  { text: '그외 근무', key: 'else' },
];

const offTypeList: TypeList[] = [
  { text: '오프', key: 'off' },
  { text: '휴가', key: 'leave' },
];

const useShiftTypeEdit = () => {
  const [shift, isEdit, setState] = useEditShiftTypeStore((state) => [
    state.currentShift,
    state.isEdit,
    state.setState,
  ]);
  const [usingTime, setUsingTime] = useState(shift.startTime ? true : false);
  const changeStartTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: Shift = { ...shift, startTime: selectedDate };
    setState('currentShift', newShift);
  };
  const changeEndTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: Shift = { ...shift, endTime: selectedDate };
    setState('currentShift', newShift);
  };
  const onChangeSwith = (value: boolean) => {
    if (value) {
      const newShift: Shift = shift.startTime
        ? shift
        : {
            ...shift,
            startTime: new Date('2023-12-31T09:00:00'),
            endTime: new Date('2023-12-31T12:00:00'),
          };
      setState('currentShift', newShift);
      setUsingTime(true);
    } else {
      const newShift: Shift = { ...shift, startTime: undefined, endTime: undefined };
      setState('currentShift', newShift);
      setUsingTime(false);
    }
  };
  const onChangeColor = (color: string) => {
    const newShift: Shift = { ...shift, color: color };
    setState('currentShift', newShift);
  };
  const onChangeTextInput = (target: 'name' | 'shortName', value: string) => {
    const newShift: Shift = { ...shift, [target]: value };
    setState('currentShift', newShift);
  };
  const onPressShiftType = (type: Shift['typeDetail']) => {
    const newShift: Shift = { ...shift, typeDetail: type };
    if (type === 'off' || type === 'leave') {
      newShift.startTime = undefined;
      newShift.endTime = undefined;
      setUsingTime(false);
    }
    setState('currentShift', newShift);
  };

  return {
    states: { shift, isEdit, usingTime, workTypeList, offTypeList },
    actions: {
      onChangeSwith,
      changeStartTime,
      changeEndTime,
      onChangeColor,
      onChangeTextInput,
      onPressShiftType,
    },
  };
};

export default useShiftTypeEdit;
