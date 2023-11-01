import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  name: string;
  phoneNum: string;
  gender: '남' | '여' | null;
  isWorker: boolean;
  step: number;
  isLoading: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useEnterWardStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
    name: '',
    step: 1,
    phoneNum: '',
    gender: null,
    isWorker: true,
    isLoading: false,
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
  })),
  shallow,
);
