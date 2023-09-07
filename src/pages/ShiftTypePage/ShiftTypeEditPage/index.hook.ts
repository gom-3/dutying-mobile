import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useEditShiftTypeStore, ShiftWithoutID } from '../store';
import { useMutation } from '@tanstack/react-query';
import { addShiftType, ShiftTypeRequestDTO } from '@libs/api/shiftTypes';
import { useAccountStore } from 'store/account';
import { useNavigation } from '@react-navigation/native';

interface TypeList {
  text: string;
  key: Shift['classification'];
}

const workTypeList: TypeList[] = [
  { text: '데이', key: 'DAY' },
  { text: '이브닝', key: 'EVENING' },
  { text: '나이트', key: 'NIGHT' },
  { text: '그외 근무', key: 'OTHER_WORK' },
];

const offTypeList: TypeList[] = [
  { text: '오프', key: 'OFF' },
  { text: '휴가', key: 'LEAVE' },
];

const useShiftTypeEdit = () => {
  const [userId] = useAccountStore((state) => [state.userId]);
  const [shift, isEdit, setState] = useEditShiftTypeStore((state) => [
    state.currentShift,
    state.isEdit,
    state.setState,
  ]);
  const [usingTime, setUsingTime] = useState(shift.startTime ? true : false);
  const navigation = useNavigation();
  const { mutate: addShiftTypeMutate } = useMutation(
    (shift: ShiftTypeRequestDTO) => addShiftType(userId, shift),
    {
      onSuccess: () => navigation.goBack(),
    },
  );
  // const {mutate:editShiftType} = useMutation();
  // const {mutate:deleteShiftType} = useMutation();

  const changeStartTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: ShiftWithoutID = { ...shift, startTime: selectedDate };
    setState('currentShift', newShift);
  };
  const changeEndTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: ShiftWithoutID = { ...shift, endTime: selectedDate };
    setState('currentShift', newShift);
  };
  const onChangeSwith = (value: boolean) => {
    if (value) {
      const newShift: ShiftWithoutID = shift.startTime
        ? shift
        : {
            ...shift,
            startTime: new Date('2023-12-31T09:00:00'),
            endTime: new Date('2023-12-31T12:00:00'),
          };
      setState('currentShift', newShift);
      setUsingTime(true);
    } else {
      const newShift: ShiftWithoutID = { ...shift, startTime: undefined, endTime: undefined };
      setState('currentShift', newShift);
      setUsingTime(false);
    }
  };
  const onChangeColor = (color: string) => {
    const newShift: ShiftWithoutID = { ...shift, color: color };
    setState('currentShift', newShift);
  };
  const onChangeTextInput = (target: 'name' | 'shortName', value: string) => {
    const newShift: ShiftWithoutID = { ...shift, [target]: value };
    setState('currentShift', newShift);
  };
  const onPressShiftType = (type: Shift['classification']) => {
    const newShift: ShiftWithoutID = { ...shift, classification: type };
    if (type === 'OTHER_WORK' || type === 'LEAVE') {
      newShift.startTime = undefined;
      newShift.endTime = undefined;
      setUsingTime(false);
    }
    setState('currentShift', newShift);
  };

  const saveNewShiftType = () => {
    console.log(1);
    if (shift.name.length > 0 && shift.shortName.length > 0) {
      console.log(2);
      if (!isEdit) {
        const startTime = `${shift.startTime
          ?.getHours()
          .toString()
          .padStart(2, '0')}:${shift.startTime?.getMinutes().toString().padStart(2, '0')}`;
        const endTime = `${shift.endTime?.getHours().toString().padStart(2, '0')}:${shift.endTime
          ?.getMinutes()
          .toString()
          .padStart(2, '0')}`;
        const reqDTO: ShiftTypeRequestDTO = { ...shift, startTime, endTime };
        addShiftTypeMutate(reqDTO);
      } else {
      }
    }
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
      saveNewShiftType,
    },
  };
};

export default useShiftTypeEdit;
