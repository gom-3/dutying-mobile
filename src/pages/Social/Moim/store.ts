import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  moimId: number;
  moimCode: string;
  weeks: Date[][];
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initCalendar: (year: number, month: number) => void;
}

export const useMoimStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
    moimId: 0,
    moimCode: '000000',
    weeks: [],
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
    initCalendar: (year, month) =>
      set(() => {
        const first = new Date(year, month, 1);
        const last = new Date(year, month + 1, 0);
        const calendar: Date[] = [];
        for (let i = first.getDay() - 1; i >= 0; i--) {
          const date = new Date(year, month, -i);
          calendar.push(date);
        }
        for (let i = 1; i <= last.getDate(); i++) {
          const date = new Date(year, month, i);
          calendar.push(date);
        }
        for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
          const date = new Date(year, month + 1, j);
          calendar.push(date);
        }
        const weeks: Date[][] = [];
        while (calendar.length > 0) weeks.push(calendar.splice(0, 7));
        return { weeks };
      }),
  })),
  shallow,
);
