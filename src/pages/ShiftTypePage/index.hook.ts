import { useLinkProps } from '@react-navigation/native';
import { useMemo } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useEditShiftTypeStore } from './store';

const useShiftTypePage = () => {
  const [initShift, setState] = useEditShiftTypeStore((state) => [state.initShift, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: navigateToEdit } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
  const workShiftTypes = useMemo(
    () => shiftTypes.filter((shiftType) => shiftType.type === 'work'),
    [shiftTypes],
  );
  const offShiftTypes = useMemo(
    () => shiftTypes.filter((shiftType) => shiftType.type === 'off'),
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
