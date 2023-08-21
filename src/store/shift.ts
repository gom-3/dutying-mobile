import { shiftList } from '@mocks/calendar';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  shiftTypes: Shift[];
  shiftRegistDate: Date;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useShiftTypeStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        shiftTypes: shiftList,
        shiftRegistDate: new Date(),
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useShiftTypeStore' },
    ),
  ),
  shallow,
);
