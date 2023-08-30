import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { Calendar } from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DeviceCalendar = Pick<Calendar, 'id' | 'name'> & { isLinked: boolean };

interface State {
  calendars: DeviceCalendar[];
  dutyingCalendars: Calendar[];
  permission: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useDeviceCalendarStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        calendars: [],
        dutyingCalendars: [],
        permission: true,
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useDevcieCalendarStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
