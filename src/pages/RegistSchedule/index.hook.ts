import { useRef, useState } from 'react';
import { createEventAsync, updateEventAsync, Event, deleteEventAsync } from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type DeviceEvent = Partial<Event>;

const useRegistSchedule = () => {
  const navigation = useNavigation();
  const ref = useRef<ScrollView | null>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const [setState] = useCaledarDateStore((state) => [state.setState]);
  const [
    id,
    calendarId,
    prevCalendarId,
    isAllday,
    title,
    alarms,
    recurrenceRule,
    startDate,
    endDate,
    notes,
    setScheduleState,
  ] = useScheduleStore((state) => [
    state.id,
    state.calendarId,
    state.prevCalendarId,
    state.isAllday,
    state.title,
    state.alarms,
    state.recurrenceRule,
    state.startDate,
    state.endDate,
    state.notes,
    state.setState,
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const event: DeviceEvent = {
    allDay: isAllday,
    alarms,
    recurrenceRule,
    title,
    startDate,
    endDate,
    notes,
  };

  const titleChangeHandler = (text: string) => {
    setScheduleState('title', text);
  };

  const notesChangeHandler = (text: string) => {
    setScheduleState('notes', text);
  };

  const createEvent = async () => {
    await createEventAsync(calendarId, event);
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };
  const updateEvent = async () => {
    if (calendarId !== prevCalendarId) {
      await deleteEventAsync(id, { futureEvents: true });
      await createEventAsync(calendarId, event);
    } else {
      await updateEventAsync(id, event, { futureEvents: true });
    }
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };
  const deleteEvent = async () => {
    await deleteEventAsync(id, { futureEvents: true });
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };

  const openModal = (name: 'alarm' | 'reculsive') => {
    modalRef.current?.present();
    setIsModalOpen(true);
    setScheduleState('modalName', name);
  };

  const closeModal = () => {
    modalRef.current?.close();
    setIsModalOpen(false);
  };

  return {
    state: {
      title,
      ref,
      modalRef,
      isModalOpen,
      notes,
    },
    actions: {
      titleChangeHandler,
      notesChangeHandler,
      createEvent,
      updateEvent,
      deleteEvent,
      openModal,
      closeModal,
    },
  };
};

export default useRegistSchedule;
