import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  account: Account;
  accessToken: string;
  deviceToken: string | null;
}

const initialAccount: Account = {
  accountId: 0,
  nurseId: 0,
  wardId: 0,
  shiftTeamId: 0,
  email: '',
  name: '',
  isManager: false,
  profileImgBase64: '',
  status: 'INITIAL',
};

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  logout: () => void;
}

export const useAccountStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        account: initialAccount,
        accessToken: '',
        deviceToken: null,
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
        logout: () => set(() => ({ account: initialAccount })),
      }),
      { name: 'useAccountStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
