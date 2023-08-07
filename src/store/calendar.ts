import { DateType } from '@pages/HomePage/components/Calendar';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  year: number;
  month: number;
  date: Date;
  isCardOpen: boolean;
  isSideMenuOpen: boolean;
  isPopupOpen: boolean;
  isDateSelectorOpen: boolean;
  onSideMenuClosing: boolean;
  calendar: DateType[];
  isCalendarReady: boolean;
  setDateOnThread: (value: string) => void;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useCaledarDateStore = create<Store>()(
  devtools((set, get) => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date(),
    calendar: [],
    onSideMenuClosing: false,
    isSideMenuOpen: false,
    isCardOpen: false,
    isPopupOpen: false,
    isDateSelectorOpen: false,
    isCalendarReady: false,
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
    setDateOnThread: (value) => set((prev) => ({ ...prev, date: new Date(value) })),
  })),
);
