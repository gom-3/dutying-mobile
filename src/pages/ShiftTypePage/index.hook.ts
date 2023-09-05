import { useLinkProps } from '@react-navigation/native';
import { useMemo } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useEditShiftTypeStore } from './store';

const workClassifications = ['데이', '이브닝', '나이트', '그외'];
const offClassification = ['오프', '휴가'];

const useShiftTypePage = () => {
  const [initShift, setState] = useEditShiftTypeStore((state) => [state.initShift, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: navigateToEdit } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
  const workShiftTypes = useMemo(
    () => shiftTypes.filter((shiftType) => workClassifications.includes(shiftType.classification)),
    [shiftTypes],
  );
  const offShiftTypes = useMemo(
    () => shiftTypes.filter((shiftType) => offClassification.includes(shiftType.classification)),
    [shiftTypes],
  );

  const onPressPlusIcon = () => {
    initShift();
    navigateToEdit();
  };

  const onPressEditIcon = (shift: Shift) => {
    setState('currentShift', shift);
    setState('isEdit', true);
    navigateToEdit();
  };

  return {
    states: { workShiftTypes, offShiftTypes },
    actions: { onPressPlusIcon, onPressEditIcon },
  };
};

export default useShiftTypePage;
