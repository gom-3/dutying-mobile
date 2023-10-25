import { useLinkProps } from '@react-navigation/native';
import { useMemo } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useEditShiftTypeStore } from './store';
import { firebaseLogEvent } from '@libs/utils/event';
import useShiftType from '@hooks/useShiftType';

const workClassifications = ['DAY', 'EVENING', 'NIGHT', 'OTHER_WORK'];
const offClassification = ['OFF', 'LEAVE', 'OTHER_LEAVE'];

const useShiftTypePage = () => {
  const [initShift, editShift] = useEditShiftTypeStore((state) => [
    state.initShift,
    state.editShift,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: navigateToEdit } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
  useShiftType();
  const workShiftTypes = useMemo(
    () =>
      Array.from(shiftTypes.size > 0 ? shiftTypes.values() : []).filter((shiftType) =>
        workClassifications.includes(shiftType.classification),
      ),
    [shiftTypes],
  );
  const offShiftTypes = useMemo(
    () =>
      Array.from(shiftTypes.size > 0 ? shiftTypes.values() : []).filter((shiftType) =>
        offClassification.includes(shiftType.classification),
      ),
    [shiftTypes],
  );

  const onPressPlusIcon = () => {
    firebaseLogEvent('move_add_shift_type');
    initShift();
    navigateToEdit();
  };

  const onPressEditIcon = (shift: Shift) => {
    firebaseLogEvent('move_edit_shift_type');
    const { accountShiftTypeId, ...shiftWithoutAccountShiftTypeId } = shift;
    editShift(shiftWithoutAccountShiftTypeId, shift.accountShiftTypeId);
    navigateToEdit();
  };

  return {
    states: { workShiftTypes, offShiftTypes },
    actions: { onPressPlusIcon, onPressEditIcon },
  };
};

export default useShiftTypePage;
