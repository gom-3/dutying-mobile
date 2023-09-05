import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  shiftTypes: Shift[];
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useShiftTypeStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        shiftTypes: [],
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useShiftTypeStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
