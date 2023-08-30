import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { Alarm, RecurrenceRule } from 'expo-calendar';

interface State {
  alarms: Alarm[];
  alarmText: string;
  recurrenceRule: RecurrenceRule | undefined;
  recurrenceRuleText: string;
  startDate: Date;
  endDate: Date;
  notes: string;
  modalName: 'date' | 'alarm' | 'reculsive' | 'category';
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useScheduleStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
    alarms: [],
    alarmText: '정각',
    recurrenceRule: undefined,
    recurrenceRuleText: '매주',
    startDate: new Date(),
    endDate: new Date(),
    notes: '',
    modalName: 'date',
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
  })),
  shallow,
);
