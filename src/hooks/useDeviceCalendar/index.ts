import { useEffect } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { useDeviceCalendarStore } from '../../store/device';
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
} from 'expo-calendar';
import { Alert, Linking } from 'react-native';

export type Schedule = Event & {
  level: number;
  isStart: boolean;
  isEnd: boolean;
  startTime: Date;
  endTime: Date;
  leftDuration: number;
  color: string;
};

const useDeviceCalendar = () => {
  const [date, calendar, isScheduleUpdated, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.isScheduleUpdated,
    state.setState,
  ]);
  const [deviceCalendar, calendarLinks, isCalendarChanged, setDeivceCalendar] =
    useDeviceCalendarStore((state) => [
      state.calendars,
      state.calendarLink,
      state.isChanged,
      state.setState,
    ]);

  const getEventFromDevice = async () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const idList = deviceCalendar
      .filter((calendar) => calendarLinks[calendar.id])
      .map((calendar) => calendar.id);

    if (idList.length === 0) return;
    
    const events = await getEventsAsync(idList, first, last);
    const newCalendar = [...calendar];

    if (isScheduleUpdated) {
      newCalendar.forEach((date) => (date.schedules = []));
    }
    events.forEach((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      const startIndex = first.getDay() + eventStartDate.getDate() - 1;
      const color =
        deviceCalendar.find((calendar) => calendar.id === event.calendarId)?.color || '#5AF8F8';
      let level;
      let endIndex = first.getDay() + eventEndDate.getDate() - 1;
      if (endIndex > newCalendar.length - 1) endIndex = newCalendar.length - 1;
      let index = startIndex;
      while (index <= endIndex) {
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
            color: color,
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
    });
    setState('calendar', newCalendar);
  };

  const getPermissionFromDevice = async () => {
    const { status } = await requestCalendarPermissionsAsync();

    if (status === 'granted') {
      let calendars = await getCalendarsAsync(EntityTypes.EVENT);
      calendars = calendars.filter((calendar) => calendar.allowsModifications === true);
      /**
       * 디바이스에서 캘린더들을 가져와 기존 zustand에 calendarLinks에 등록되지 않은 캘린더면 새로 등록하고 true 값을 넣는다.
       * 이것은 새로 생긴 캘린더들은 기본적으로 듀팅 캘린더에 연동되는 것을 의미한다. 이미 이전에 정의된 캘린더는 그대로 둔다.
       * */

      const newMap: { [key: string]: boolean } = { ...calendarLinks };
      calendars.forEach((key) => {
        if (newMap[key.id] === undefined) {
          newMap[key.id] = true;
        }
      });
      setDeivceCalendar('calendarLink', newMap);

      /**
       * 듀팅- 접두사로 시작하는 캘린더들은 듀팅 캘린더로 구분된다. 디바이스에서 가져온 캘린더들 중에
       * 만약 듀팅 캘린더가 한개도 없을 시 사전에 정의된 2종류의 듀팅 캘린더가 디바이스에 추가된다.
       */

      let deviceDutyingCalendars = calendars.filter((calendar) =>
        calendar.title.startsWith('듀팅'),
      );
      if (deviceDutyingCalendars.length === 0) {
        await createCalendarAsync(newCalendars[0]);
        await createCalendarAsync(newCalendars[1]);
        calendars = await getCalendarsAsync();
        calendars = calendars.filter((calendar) => calendar.allowsModifications === true);
        deviceDutyingCalendars = calendars.filter((calendar) => calendar.title.startsWith('듀팅'));
        setDeivceCalendar('dutyingCalendars', deviceDutyingCalendars);
      }
      setDeivceCalendar('dutyingCalendars', deviceDutyingCalendars);
      setDeivceCalendar('calendars', calendars);
      console.log(calendars);
      console.log(deviceDutyingCalendars);
    } else {
      Alert.alert(
        '권한 거부됨',
        '캘린더 접근 권한이 거부되었습니다. 설정에서 권한을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          // 설정으로 이동하는 버튼
          {
            text: '설정으로 이동',
            onPress: () => Linking.openURL('app-settings:'),
          },
        ],
      );
    }
  };

  useEffect(() => {
    getPermissionFromDevice();
  }, []);

  useEffect(() => {
    if (isCalendarChanged) {
      getPermissionFromDevice();
      setDeivceCalendar('isChanged', false);
    }
  }, [isCalendarChanged]);

  useEffect(() => {
    if (isScheduleUpdated) {
      getEventFromDevice();
      setState('isScheduleUpdated', false);
    }
  }, [isScheduleUpdated]);
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
