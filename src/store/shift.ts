import { shiftList } from '@mocks/calendar';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  shiftTypes: Shift[];
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useShiftTypeStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        shiftTypes: shiftList,
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useShiftTypeStore' },
    ),
  ),
);
