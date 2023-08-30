import { DateType } from '@pages/HomePage/components/Calendar';
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

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
  isScheduleUpdated: boolean;
  setDateOnThread: (value: string) => void;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useCaledarDateStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
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
    isScheduleUpdated: false,
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
    setDateOnThread: (value) => set((prev) => ({ ...prev, date: new Date(value) })),
  })),
  shallow,
);
