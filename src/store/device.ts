import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { Calendar } from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface State {
  calendars: Calendar[];
  calendarLink: {
    [key: string]: boolean;
  };
  dutyingCalendars: Calendar[];
  isChanged: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  setLink: (key: string, value: any) => void;
}

export const useDeviceCalendarStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, _) => ({
        calendars: [],
        calendarLink: {},
        dutyingCalendars: [],
        isChanged: true,
        setLink: (key, value) =>
          set((state) => ({ calendarLink: { ...state.calendarLink, [key]: value } })),
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useDevcieCalendarStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
