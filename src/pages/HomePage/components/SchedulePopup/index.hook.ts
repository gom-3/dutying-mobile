import { useState } from 'react';
import { createEventAsync, Event, Frequency } from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from 'hooks/useDeviceCalendar/store';

type DeviceEvent = Partial<Event>;

const useSchedulePopup = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [calendars] = useDeviceCalendarStore((state) => [state.calendars]);

  const [isTimeEnable, setIsTimeEnable] = useState(false);
  const [isAlarmEnable, setIsAlarmEnable] = useState(false);
  const [isRepeatEnable, setIsRepeatEnable] = useState(false);
  const [titleText, setTitleText] = useState('');

  const event: DeviceEvent = {
    title: titleText,
    startDate: date,
    endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()+5),
  };

  const titleInputChangeHandler = (text: string) => {
    setTitleText(text);
  };

  const createEvent = async () => {
    await createEventAsync(calendars[0].id, event);
    setState('isScheduleUpdated', true);
    setState('isPopupOpen', false);
  };

  return {
    state: { isTimeEnable, isAlarmEnable, isRepeatEnable, titleText },
    actions: {
      setIsRepeatEnable,
      setIsAlarmEnable,
      setIsTimeEnable,
      titleInputChangeHandler,
      createEvent,
    },
  };
};

export default useSchedulePopup;
