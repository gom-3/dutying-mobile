import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useEditShiftTypeStore, ShiftWithoutID } from '../store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addShiftType,
  deleteShiftType,
  editShiftType,
  ShiftTypeRequestDTO,
} from '@libs/api/shiftTypes';
import { useAccountStore } from 'store/account';
import { useNavigation } from '@react-navigation/native';
import { firebaseLogEvent } from '@libs/utils/event';

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
  const [userId] = useAccountStore((state) => [state.account.accountId]);
  const [shift, isEdit, accountShiftTypeId, setState] = useEditShiftTypeStore((state) => [
    state.currentShift,
    state.isEdit,
    state.accountShiftTypeId,
    state.setState,
  ]);
  const [usingTime, setUsingTime] = useState(shift.startTime ? true : false);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const onSuccessMutate = () => {
    queryClient.invalidateQueries(['getShiftTypes', userId]);
    navigation.goBack();
  };

  const { mutate: addShiftTypeMutate } = useMutation(
    (shift: ShiftTypeRequestDTO) => addShiftType(userId, shift),
    {
      onSuccess: onSuccessMutate,
    },
  );
  const { mutate: editShiftTypeMutate } = useMutation(
    ({ shiftId, shift }: { shiftId: number; shift: ShiftTypeRequestDTO }) =>
      editShiftType(userId, shiftId, shift),
    {
      onSuccess: onSuccessMutate,
    },
  );
  const { mutate: deleteShiftTypeMutate } = useMutation(
    (shiftId: number) => deleteShiftType(userId, shiftId),
    {
      onSuccess: onSuccessMutate,
    },
  );

  const changeStartTime = (_: DateTimePickerEvent, selectedDate: Date | null) => {
    const newShift: ShiftWithoutID = { ...shift, startTime: selectedDate };
    setState('currentShift', newShift);
  };
  const changeEndTime = (_: DateTimePickerEvent, selectedDate: Date | null) => {
    const newShift: ShiftWithoutID = { ...shift, endTime: selectedDate };
    setState('currentShift', newShift);
  };
  const onChangeSwith = (value: boolean) => {
    firebaseLogEvent('change_shift_time');
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
      const newShift: ShiftWithoutID = { ...shift, startTime: null, endTime: null };
      setState('currentShift', newShift);
      setUsingTime(false);
    }
  };
  const onChangeColor = (color: string) => {
    firebaseLogEvent('change_shift_color');
    const newShift: ShiftWithoutID = { ...shift, color: color };
    setState('currentShift', newShift);
  };
  const onChangeTextInput = (target: 'name' | 'shortName', value: string) => {
    const newShift: ShiftWithoutID = { ...shift, [target]: value };
    setState('currentShift', newShift);
  };
  const onPressShiftType = (type: Shift['classification']) => {
    firebaseLogEvent('change_shift_classification');
    const newShift: ShiftWithoutID = { ...shift, classification: type };
    if (type === 'OTHER_WORK' || type === 'LEAVE') {
      newShift.startTime = null;
      newShift.endTime = null;
      setUsingTime(false);
    }
    setState('currentShift', newShift);
  };
  const onPressDeleteButton = () => {
    firebaseLogEvent('delete_shfit_type');
    deleteShiftTypeMutate(accountShiftTypeId);
  };
  const onPressSaveButton = () => {
    if (shift.name.length > 0 && shift.shortName.length > 0) {
      const startTime = shift.startTime
        ? `${shift.startTime.getHours().toString().padStart(2, '0')}:${shift.startTime
            ?.getMinutes()
            .toString()
            .padStart(2, '0')}`
        : null;
      const endTime = shift.endTime
        ? `${shift.endTime?.getHours().toString().padStart(2, '0')}:${shift.endTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        : null;
      const reqDTO: ShiftTypeRequestDTO = { ...shift, startTime, endTime };
      if (!isEdit) {
        firebaseLogEvent('add_shfit_type');
        addShiftTypeMutate(reqDTO);
      } else {
        firebaseLogEvent('edit_shift_type');
        editShiftTypeMutate({ shiftId: accountShiftTypeId, shift: reqDTO });
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
      onPressSaveButton,
      onPressDeleteButton,
    },
  };
};

export default useShiftTypeEdit;
