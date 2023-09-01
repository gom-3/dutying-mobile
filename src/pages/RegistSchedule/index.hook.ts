import { useEffect, useRef, useState } from 'react';
import { createEventAsync, Event } from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from 'store/device';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type DeviceEvent = Partial<Event>;

const useSchedulePopup = () => {
  const navigation = useNavigation();
  const ref = useRef<ScrollView | null>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [alarms, recurrenceRule, startDate, endDate, setScheduleState] = useScheduleStore(
    (state) => [state.alarms, state.recurrenceRule, state.startDate, state.endDate, state.setState],
  );
  const [calendars] = useDeviceCalendarStore((state) => [state.calendars]);
  const [titleText, setTitleText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const event: DeviceEvent = {
    alarms,
    recurrenceRule,
    title: titleText,
    startDate: startDate,
    endDate: endDate,
  };

  const titleInputChangeHandler = (text: string) => {
    setTitleText(text);
  };

  const createEvent = async () => {
    await createEventAsync(calendars[0].id, event);
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };

  const openModal = (name: 'date' | 'alarm' | 'reculsive' | 'category') => {
    modalRef.current?.present();
    setIsModalOpen(true);
    setScheduleState('modalName', name);
  };

  const closeModal = () => {
    modalRef.current?.close();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const startDate = new Date(date);
    startDate.setHours(8, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(9, 0, 0, 0);
    setScheduleState('startDate', startDate);
    setScheduleState('endDate', endDate);
    setScheduleState('alarms', []);
    setScheduleState('alarmText', '정각');
    setScheduleState('recurrenceRule', undefined);
    setScheduleState('recurrenceRuleText', '매일');
  }, []);

  return {
    state: {
      titleText,
      ref,
      startDate,
      endDate,
      modalRef,
      isModalOpen,
    },
    actions: {
      titleInputChangeHandler,
      createEvent,
      openModal,
      closeModal,
    },
  };
};

export default useSchedulePopup;
