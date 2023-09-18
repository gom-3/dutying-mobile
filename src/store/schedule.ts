import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { Alarm, RecurrenceRule } from 'expo-calendar';
import { Schedule } from '@hooks/useDeviceCalendar';
import { alarmList, getRecurrenceRuleList } from '@libs/utils/event';

interface State {
  id: string;
  calendarId: string;
  title: string;
  isAllday: boolean;
  isAlarmUsing: boolean;
  alarms: Alarm[];
  alarmText: string;
  isRecurrenceUsing: boolean;
  recurrenceRule: RecurrenceRule | undefined;
  recurrenceRuleText: string;
  startDate: Date;
  endDate: Date;
  notes: string;
  modalName: 'alarm' | 'reculsive';
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initStateEdit: (schedule: Schedule) => void;
  initStateCreate: (date: Date) => void;
}

const initialState: State = {
  id: '',
  calendarId: '',
  title: '',
  isAllday: false,
  isAlarmUsing: false,
  alarms: [],
  alarmText: '정각',
  isRecurrenceUsing: false,
  recurrenceRule: undefined,
  recurrenceRuleText: '매주',
  startDate: new Date(),
  endDate: new Date(),
  notes: '',
  modalName: 'alarm',
};

export const useScheduleStore = createWithEqualityFn<Store>()(
  devtools((set, _) => ({
    ...initialState,
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
    initStateCreate: (date: Date) =>
      set((prev) => {
        const startDate = new Date(date);
        startDate.setHours(8, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(9, 0, 0, 0);
        return { ...prev, ...initialState, startDate, endDate };
      }),
    initStateEdit: (schedule) =>
      set((prev) => {
        const startDate: Date =
          typeof schedule.startDate === 'string'
            ? new Date(schedule.startDate)
            : schedule.startDate;
        const endDate: Date =
          typeof schedule.endDate === 'string' ? new Date(schedule.endDate) : schedule.endDate;
        let alarmText = '정각';
        if (schedule.alarms[0]) {
          const found = alarmList.find((item) => item.time === schedule.alarms[0].relativeOffset);
          if (found) alarmText = found.text;
        }
        let recurrenceRuleText = '매주';
        if (schedule.recurrenceRule) {
          const recurrenceRuleList = getRecurrenceRuleList(startDate);
          const found = recurrenceRuleList.find(
            (item) => item.frequency === schedule.recurrenceRule.frequency,
          );
          if (found) recurrenceRuleText = found.text;
        }
        return {
          ...prev,
          isAllday: schedule.allDay,
          id: schedule.id,
          calendarId: schedule.calendarId,
          title: schedule.title,
          isAlarmUsing: schedule.alarms.length > 0,
          alarms: schedule.alarms,
          alarmText: alarmText,
          isRecurrenceUsing: schedule.recurrenceRule !== undefined,
          recurrenceRule: schedule.recurrenceRule,
          recurrenceRuleText: recurrenceRuleText,
          startDate: startDate,
          endDate: endDate,
          notes: schedule.notes || '',
        };
      }),
  })),
  shallow,
);
