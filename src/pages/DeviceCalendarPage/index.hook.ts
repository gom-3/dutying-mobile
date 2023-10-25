import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Availability,
  Calendar,
  CalendarAccessLevel,
  CalendarType,
  EntityTypes,
  createCalendarAsync,
  updateCalendarAsync,
  deleteCalendarAsync,
} from 'expo-calendar';
import { useEffect, useRef, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from 'store/device';
import { firebaseLogEvent } from '@libs/utils/event';
import { useRoute } from '@react-navigation/native';

const useDeviceCalendarPage = () => {
  const [calendars, dutyingCalendars, calendarLink, setLink, setState] = useDeviceCalendarStore(
    (state) => [
      state.calendars,
      state.dutyingCalendars,
      state.calendarLink,
      state.setLink,
      state.setState,
    ],
  );
  const { params } = useRoute<any>();

  const [setScheduleState] = useCaledarDateStore((state) => [state.setState]);
  const [isValid, setIsValid] = useState({ name: true, color: true });
  const [color, setColor] = useState('');
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');

  const textRef = useRef<string>('');
  const ref = useRef<BottomSheetModal>(null);

  const normalCalendars = calendars.filter((calendar) => !calendar.title?.startsWith('듀팅'));
  const pressLinkHandler = (id: string) => {
    firebaseLogEvent('link_calendar');
    setLink(id, !calendarLink[id]);
    setScheduleState('isScheduleUpdated', true);
  };

  const openModalCreateMode = () => {
    firebaseLogEvent('add_calendar');
    ref.current?.present();
    setColor('');
    setIsEdit(false);
    textRef.current = '';
  };

  const openModalEditMode = (calendar: Calendar) => {
    firebaseLogEvent('edit_calendar');
    ref.current?.present();
    setColor(calendar.color);
    setName(calendar.title.slice(3));
    setId(calendar.id);
    setIsEdit(true);
  };

  const createCalendar = async () => {
    if (textRef.current.length > 0 && color.length > 0) {
      if (!isEdit) {
        await createCalendarAsync({
          accessLevel: CalendarAccessLevel.OWNER,
          ownerAccount: 'Dutying',
          name: textRef.current,
          id: textRef.current,
          allowsModifications: true,
          title: `듀팅-${textRef.current}`,
          color: color,
          allowedAvailabilities: [Availability.BUSY, Availability.FREE],
          source: { name: 'dutying', type: CalendarType.LOCAL, id: 'Dutying' },
          entityType: EntityTypes.EVENT,
        });
      } else {
        await updateCalendarAsync(id, {
          title: `듀팅-${textRef.current}`,
          color: color,
        });
      }
      setState('isChanged', true);
      ref.current?.close();
    } else {
      if (textRef.current.length === 0) {
        setIsValid((prev) => ({ ...prev, name: false }));
      }
      if (color.length === 0) {
        setIsValid((prev) => ({ ...prev, color: false }));
      }
    }
  };

  const deleteCalendar = async () => {
    firebaseLogEvent('delete_calendar');
    await deleteCalendarAsync(id);
    setState('isChanged', true);
    ref.current?.close();
  };

  useEffect(() => {
    if (ref.current && params && params.isRedirected) ref.current.present();
  }, [params, ref]);

  return {
    states: {
      isValid,
      textRef,
      isEdit,
      color,
      name,
      ref,
      normalCalendars,
      dutyingCalendars,
      calendarLink,
    },
    actions: {
      setColor,
      pressLinkHandler,
      openModalCreateMode,
      openModalEditMode,
      createCalendar,
      deleteCalendar,
      setIsValid,
    },
  };
};

export default useDeviceCalendarPage;
