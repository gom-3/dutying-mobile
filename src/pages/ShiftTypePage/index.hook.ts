import { useLinkProps } from '@react-navigation/native';
import { useMemo } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useEditShiftTypeStore } from './store';

const workClassifications = ['DAY', 'EVENING', 'NIGHT', 'OTHER_WORK'];
const offClassification = ['OFF', 'LEAVE'];

const useShiftTypePage = () => {
  const [initShift, setState] = useEditShiftTypeStore((state) => [state.initShift, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: navigateToEdit } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
  const workShiftTypes = useMemo(
    () =>
      Array.from(shiftTypes.values()).filter((shiftType) =>
        workClassifications.includes(shiftType.classification),
      ),
    [shiftTypes],
  );
  const offShiftTypes = useMemo(
    () =>
      Array.from(shiftTypes.values()).filter((shiftType) =>
        offClassification.includes(shiftType.classification),
      ),
    [shiftTypes],
  );

  const onPressPlusIcon = () => {
    initShift();
    navigateToEdit();
  };

  const onPressEditIcon = (shift: Shift) => {
    const {accountShiftTypeId, ...shiftWithoutAccountShiftTypeId} = shift;
    setState('currentShift', shiftWithoutAccountShiftTypeId);
    setState('accountShiftTypeId', shift.accountShiftTypeId);
    setState('isEdit', true);
    navigateToEdit();
  };

  return {
    states: { workShiftTypes, offShiftTypes },
    actions: { onPressPlusIcon, onPressEditIcon },
  };
};

export default useShiftTypePage;
