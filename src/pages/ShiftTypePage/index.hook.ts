import { useLinkProps } from '@react-navigation/native';
import { useMemo } from 'react';
import { useShiftTypeStore } from 'store/shift';
import { useEditShiftTypeStore } from './store';
import analytics from '@react-native-firebase/analytics';

const workClassifications = ['DAY', 'EVENING', 'NIGHT', 'OTHER_WORK'];
const offClassification = ['OFF', 'LEAVE'];

const useShiftTypePage = () => {
  const [initShift, setState] = useEditShiftTypeStore((state) => [state.initShift, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: navigateToEdit } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
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
    analytics().logEvent('move_add_shift_type');
    initShift();
    navigateToEdit();
  };

  const onPressEditIcon = (shift: Shift) => {
    analytics().logEvent('move_edit_shift_type');
    const { accountShiftTypeId, ...shiftWithoutAccountShiftTypeId } = shift;
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
