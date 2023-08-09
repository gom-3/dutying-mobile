import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { Alarm, RecurrenceRule } from 'expo-calendar';

interface State {
  alarms: Alarm[];
  recurrenceRule: RecurrenceRule | null;
  startDate: Date;
  endDate: Date;
  notes: string;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useScheduleStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
    alarms: [],
    recurrenceRule: null,
    startDate: new Date(),
    endDate: new Date(),
    notes: '',
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
  })),
  shallow,
);
