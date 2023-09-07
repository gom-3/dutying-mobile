import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  // shiftTypes: Shift[];
  userId: number;
  isLoggedIn: boolean;
  token: string;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useAccountStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        userId: 1,
        isLoggedIn: false,
        token: '',
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useShiftTypeStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);