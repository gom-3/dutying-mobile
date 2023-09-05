import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useEditShiftTypeStore } from '../store';
import { CreateShiftTypeDTO } from 'api/shift';

interface TypeList {
  text: string;
  key: Shift['classification'];
}

const workTypeList: TypeList[] = [
  { text: '데이', key: '데이' },
  { text: '이브닝', key: '이브닝' },
  { text: '나이트', key: '나이트' },
  { text: '그외 근무', key: 'ELSE' },
];

const offTypeList: TypeList[] = [
  { text: '오프', key: '오프' },
  { text: '휴가', key: 'LEAVE' },
];

const useShiftTypeEdit = () => {
  const [shift, isEdit, setState] = useEditShiftTypeStore((state) => [
    state.currentShift,
    state.isEdit,
    state.setState,
  ]);
  const [usingTime, setUsingTime] = useState(shift.startTime ? true : false);
  const changeStartTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: CreateShiftTypeDTO = { ...shift, startTime: selectedDate };
    setState('currentShift', newShift);
  };
  const changeEndTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: CreateShiftTypeDTO = { ...shift, endTime: selectedDate };
    setState('currentShift', newShift);
  };
  const onChangeSwith = (value: boolean) => {
    if (value) {
      const newShift: CreateShiftTypeDTO = shift.startTime
        ? shift
        : {
            ...shift,
            startTime: new Date('2023-12-31T09:00:00'),
            endTime: new Date('2023-12-31T12:00:00'),
          };
      setState('currentShift', newShift);
      setUsingTime(true);
    } else {
      const newShift: CreateShiftTypeDTO = { ...shift, startTime: undefined, endTime: undefined };
      setState('currentShift', newShift);
      setUsingTime(false);
    }
  };
  const onChangeColor = (color: string) => {
    const newShift: CreateShiftTypeDTO = { ...shift, color: color };
    setState('currentShift', newShift);
  };
  const onChangeTextInput = (target: 'name' | 'shortName', value: string) => {
    const newShift: CreateShiftTypeDTO = { ...shift, [target]: value };
    setState('currentShift', newShift);
  };
  const onPressShiftType = (type: Shift['classification']) => {
    const newShift: CreateShiftTypeDTO = { ...shift, classification: type };
    if (type === '오프' || type === 'LEAVE') {
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
