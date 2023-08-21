import { useRef, useState } from 'react';
import { createEventAsync, Event, Frequency } from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from 'hooks/useDeviceCalendar/store';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';

type DeviceEvent = Partial<Event>;

const useSchedulePopup = () => {
  const ref = useRef<ScrollView | null>(null);
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [calendars] = useDeviceCalendarStore((state) => [state.calendars]);

  const [titleText, setTitleText] = useState('');

  const navigation = useNavigation();

  const backToPrevPage = () => {
    navigation.goBack();
  };

  const event: DeviceEvent = {
    title: titleText,
    startDate: date,
    endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5),
  };

  const titleInputChangeHandler = (text: string) => {
    setTitleText(text);
  };

  const createEvent = async () => {
    await createEventAsync(calendars[0].id, event);
    setState('isScheduleUpdated', true);
    backToPrevPage();
  };

  return {
    state: { titleText, ref },
    actions: {
      titleInputChangeHandler,
      createEvent,
      backToPrevPage,
    },
  };
};

export default useSchedulePopup;
