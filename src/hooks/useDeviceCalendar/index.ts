import { useEffect } from 'react';
import * as Calendar from 'expo-calendar';

const useDeviceCalendar = () => {
  const getPermissionFromDevice = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      console.log({ calendars });
    }
  };

  useEffect(() => {
    getPermissionFromDevice();
  }, []);
};

export default useDeviceCalendar;
