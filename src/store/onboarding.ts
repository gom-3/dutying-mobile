import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  regist: boolean;
  moim: boolean;
  moimDetail: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

export const useOnboardingStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        regist: false,
        moim: false,
        moimDetail: false,
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
        initState: () => set(() => ({ regist: false, moim: false, moimDetail: false })),
      }),
      { name: 'useOnboardingStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
