import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLinkProps } from '@react-navigation/native';
import { Calendar } from 'expo-calendar';
import { useEffect, useMemo, useRef } from 'react';
import { useDeviceCalendarStore } from 'store/device';
import { useScheduleStore } from 'store/schedule';

const useCategory = () => {
  const [deviceCalendar] = useDeviceCalendarStore((state) => [state.dutyingCalendars]);
  const [calendarId, setState] = useScheduleStore((state) => [state.calendarId, state.setState]);
  const { onPress: navigateEditDeviceCalendar } = useLinkProps({
    to: { screen: 'DeviceCalendar', params: { isRedirected: true } },
  });

  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (calendarId === '') setState('calendarId', deviceCalendar[0].id);
  }, []);
  const selectedCalendar = useMemo(
    () => deviceCalendar.find((calendar) => calendar.id === calendarId) || deviceCalendar[0],
    [calendarId],
  );

  const openModal = () => {
    ref.current?.present();
  };

  const pressCategoryHandler = (calendar: Calendar) => {
    setState('calendarId', calendar.id);
    ref.current?.close();
  };

  return {
    states: { deviceCalendar, selectedCalendar, ref },
    actions: { openModal, pressCategoryHandler, navigateEditDeviceCalendar },
  };
};

export default useCategory;
