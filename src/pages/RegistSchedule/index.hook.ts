import { useRef, useState } from 'react';
import { createEventAsync, updateEventAsync, Event, deleteEventAsync } from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from 'store/device';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { useScheduleStore } from 'store/schedule';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type DeviceEvent = Partial<Event>;

const useRegistSchedule = (isEdit?: boolean) => {
  const navigation = useNavigation();
  const ref = useRef<ScrollView | null>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const [setState] = useCaledarDateStore((state) => [state.setState]);
  const [id, title, alarms, recurrenceRule, startDate, endDate, notes, setScheduleState] =
    useScheduleStore((state) => [
      state.id,
      state.title,
      state.alarms,
      state.recurrenceRule,
      state.startDate,
      state.endDate,
      state.notes,
      state.setState,
    ]);
  const [calendars] = useDeviceCalendarStore((state) => [state.calendars]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const event: DeviceEvent = {
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
    await createEventAsync(calendars[0].id, event);
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };
  const updateEvent = async () => {
    await updateEventAsync(id, event, { futureEvents: true });
    setState('isScheduleUpdated', true);
    navigation.goBack();
  };
  const deleteEvent = async () => {
    await deleteEventAsync(id, { futureEvents: true });
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

  return {
    state: {
      title,
      ref,
      startDate,
      endDate,
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
