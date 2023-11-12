import { useRef, useState } from 'react';
import { createEventAsync, updateEventAsync, Event, deleteEventAsync } from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Platform, ScrollView } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { firebaseLogEvent } from '@libs/utils/event';

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
    startDate: isAllday && Platform.OS === 'android'
      ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1)
      : startDate,
    endDate: isAllday && Platform.OS === 'android'
      ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 2)
      : endDate,
    notes,
  };

  const titleChangeHandler = (text: string) => {
    setScheduleState('title', text);
  };

  const notesChangeHandler = (text: string) => {
    setScheduleState('notes', text);
  };

  const createEvent = async () => {
    firebaseLogEvent('createSchedule');
    await createEventAsync(calendarId, event);
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };
  const updateEvent = async () => {
    firebaseLogEvent('editSchedule');
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
    Keyboard.dismiss();
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
