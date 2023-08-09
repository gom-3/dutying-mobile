import { useEffect } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from './store';
import {
  Event,
  Calendar,
  createCalendarAsync,
  getEventsAsync,
  requestCalendarPermissionsAsync,
  getCalendarsAsync,
  Availability,
  CalendarType,
  EntityTypes,
  CalendarAccessLevel,
  deleteCalendarAsync,
} from 'expo-calendar';

export type Schedule = Event & {
  level: number;
  isStart: boolean;
  isEnd: boolean;
  startTime: Date;
  endTime: Date;
  leftDuration: number;
};

const useDeviceCalendar = () => {
  const [date, calendar, isCalendarReady, isScheduleUpdated, setState] = useCaledarDateStore(
    (state) => [
      state.date,
      state.calendar,
      state.isCalendarReady,
      state.isScheduleUpdated,
      state.setState,
    ],
  );
  const [deviceCalendar, dutyingCalendars, setDeivceCalendar] = useDeviceCalendarStore((state) => [
    state.calendars,
    state.dutyingCalendars,
    state.setState,
  ]);

  const getEventFromDevice = async () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    // const startDate = new Date(year, month, -(first.getDay() - 1)); 전달 까지 범위 확대
    // const endDate = new Date(year, month + 1, 6 - last.getDay()); 다음달 까지 범위 확대

    const events = await getEventsAsync(['1', '2', '3', '5'], first, last);
    const newCalendar = [...calendar];

    if (isScheduleUpdated) {
      newCalendar.forEach((date) => (date.schedules = []));
    }

    events.forEach((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      const startIndex = first.getDay() + eventStartDate.getDate() - 1;
      let level;
      if (event.allDay) {
        const schedules = [...newCalendar[startIndex].schedules];
        const occupiedLevels = new Set(schedules.map((schedule) => schedule.level));
        level = 1;
        while (occupiedLevels.has(level)) {
          level++;
        }
        const schedule: Schedule = {
          ...event,
          startTime: eventStartDate,
          endTime: eventEndDate,
          level,
          isStart: true,
          isEnd: true,
          leftDuration: 0,
        };
        schedules.push(schedule);
        newCalendar[startIndex].schedules = schedules;
      } else {
        let endIndex = first.getDay() + eventEndDate.getDate() - 1;
        if (endIndex > newCalendar.length - 1) endIndex = newCalendar.length - 1;
        let index = startIndex;
        while (index <= endIndex) {
          console.log(index, newCalendar[index].schedules);
          const occupiedLevels = new Set();
          let jump = 0;
          for (let i = index; i <= endIndex; i++) {
            const schedules = newCalendar[i].schedules;
            jump++;
            schedules.forEach((schedule) => occupiedLevels.add(schedule.level));
            if (newCalendar[i].date.getDay() == 6) break;
          }

          level = 1;
          while (occupiedLevels.has(level)) {
            level++;
          }

          for (let i = index; i < index + jump; i++) {
            const schedule: Schedule = {
              ...event,
              startTime: eventStartDate,
              endTime: eventEndDate,
              level,
              isStart: eventStartDate.getDate() === newCalendar[i].date.getDate(),
              isEnd: eventEndDate.getDate() === newCalendar[i].date.getDate(),
              leftDuration: endIndex - i,
            };
            const schedules = [...newCalendar[i].schedules];
            schedules.push(schedule);
            newCalendar[i].schedules = schedules;
          }
          index = index + jump;
        }
      }
    });
    setState('calendar', newCalendar);
  };

  const getPermissionFromDevice = async () => {
    const { status } = await requestCalendarPermissionsAsync();

    if (status === 'granted') {
      let calendars = await getCalendarsAsync();
      let deviceDutyingCalendars = calendars.filter((calendar) =>
        calendar.title.startsWith('듀팅'),
      );
      if (dutyingCalendars.length === 0 && deviceDutyingCalendars.length === 0) {
        await createCalendarAsync(newCalendars[0]);
        await createCalendarAsync(newCalendars[1]);
        calendars = await getCalendarsAsync();
        deviceDutyingCalendars = calendars.filter((calendar) => calendar.title.startsWith('듀팅'));
        setDeivceCalendar('dutyingCalendars', deviceDutyingCalendars);
      }
      const deviceCalendars = calendars.map((calendar) => ({
        id: calendar.id,
        name: calendar.name,
        isLinked: true,
      }));
      setDeivceCalendar('calendars', deviceCalendars);
    }
  };

  useEffect(() => {
    getPermissionFromDevice();
  }, []);

  useEffect(() => {
    if (isCalendarReady || isScheduleUpdated) {
      getEventFromDevice();
      setState('isCalendarReady', false);
      setState('isScheduleUpdated', false);
    }
  }, [isCalendarReady, isScheduleUpdated]);

  return;
};

const newCalendars: Partial<Calendar>[] = [
  {
    accessLevel: CalendarAccessLevel.OWNER,
    ownerAccount: 'Dutying',
    name: 'dutying-appointment',
    id: 'duyting-appointment',
    title: '듀팅-일정',
    allowsModifications: true,
    color: '#5af8f8',
    allowedAvailabilities: [Availability.BUSY, Availability.FREE],
    source: { name: 'dutying', type: CalendarType.LOCAL, id: 'Dutying' },
    entityType: EntityTypes.EVENT,
  },
  {
    accessLevel: CalendarAccessLevel.OWNER,
    ownerAccount: 'Dutying',
    name: 'dutying-appointment',
    id: 'duyting-appointment',
    title: '듀팅-할일',
    allowsModifications: true,
    color: '#F8E85A',
    allowedAvailabilities: [Availability.BUSY, Availability.FREE],
    source: { name: 'dutying', type: CalendarType.LOCAL, id: 'Dutying' },
    entityType: EntityTypes.EVENT,
  },
];

export default useDeviceCalendar;
