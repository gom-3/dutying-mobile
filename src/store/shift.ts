import { shiftList } from '@mocks/calendar';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  shiftTypes: Shift[];
  currentShift: Shift;
}

const randomHexColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

const initialShift = (): Shift => {
  return {
    name: '',
    shortName: '',
    startTime: undefined,
    endTime: undefined,
    type: 'work',
    typeDetail: 'else',
    color: randomHexColor(),
  };
};

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initShift: () => void;
}

export const useShiftTypeStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        shiftTypes: shiftList,
        currentShift: initialShift(),
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
        initShift: () => set((prev) => ({ ...prev, currentShift: initialShift() })),
      }),
      { name: 'useShiftTypeStore' },
    ),
  ),
  shallow,
);
