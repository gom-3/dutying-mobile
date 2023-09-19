import { images } from '@assets/images/profiles';
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  id: number;
  name: string;
  image: any;
  photo: string | null;
  step: number;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useSignupStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
    id: 0,
    name: '',
    step: 1,
    photo: null,
    isPhoto: false,
    image: images[Math.floor(Math.random() * 30)],
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
  })),
  shallow,
);
