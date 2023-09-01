import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

const useDatePicker = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);


  return { states: { bottomSheetRef }, actions: {} };
};

export default useDatePicker;
