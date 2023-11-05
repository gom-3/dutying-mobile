import { useEffect, useState } from 'react';
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
import { Alert, Linking, Platform } from 'react-native';
import { dateDiffInDays } from '@libs/utils/date';

export type Schedule = Event & {
  level: number;
  isStart: boolean;
  isEnd: boolean;
  startTime: Date;
  endTime: Date;
  leftDuration: number;
  color: string;
  editbale: boolean;
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
  const [editableCalendar, setEditableCalendar] = useState<Calendar[]>([]);
  const [granted, setGranted] = useState(false);

  const getEventFromDevice = async () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last =
      Platform.OS === 'android' ? new Date(year, month + 1, 10) : new Date(year, month + 1, 1);
    const idList = deviceCalendar
      .filter((calendar) => calendarLinks[calendar.id])
      .map((calendar) => calendar.id);
    if (idList.length === 0) return;

    let events = await getEventsAsync(idList, first, last);
    if (Platform.OS === 'android') {
      events = events.filter((event) => new Date(event.startDate).getMonth() === date.getMonth());
    }
    const newCalendar = [...calendar];
    if (isScheduleUpdated) {
      newCalendar.forEach((date) => (date.schedules = []));
    }
    events = events.sort(
      (a, b) =>
        dateDiffInDays(new Date(b.startDate), new Date(b.endDate)) -
        dateDiffInDays(new Date(a.startDate), new Date(a.endDate)),
    );
    events.forEach((event) => {
      const eventStartDate = new Date(event.startDate);
      let eventEndDate = new Date(event.endDate);
      if (event.allDay && Platform.OS === 'android')
        eventEndDate = new Date(
          eventEndDate.getFullYear(),
          eventEndDate.getMonth(),
          eventEndDate.getDate() - 1,
        );
      let startIndex = first.getDay() + eventStartDate.getDate() - 1;
      const color =
        deviceCalendar.find((calendar) => calendar.id === event.calendarId)?.color || '#5AF8F8';
      let level;
      let endIndex = first.getDay() + eventEndDate.getDate() - 1;

      /**
       * 이전 달에서 이번 달로 이어지는 Event, 이번 달에서 다음 달로 이어지는 Event
       * 이전 년도에서 이번 년도로 이어지는 Event, 이번 년도에서 다음 년도로 이어지는 Event
       * index 예외처리
       */
      if (
        eventEndDate.getMonth() > date.getMonth() ||
        eventEndDate.getFullYear() > date.getFullYear()
      )
        endIndex += new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), 0).getDate();

      if (
        (eventStartDate.getFullYear() > date.getFullYear() &&
          eventStartDate.getMonth() > date.getMonth()) ||
        eventStartDate.getFullYear() > date.getFullYear()
      )
        startIndex += new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), 0).getDate();

      if (
        eventStartDate.getMonth() < date.getMonth() ||
        eventStartDate.getFullYear() < date.getFullYear()
      )
        startIndex -= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

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
            isStart:
              eventStartDate.getMonth() === newCalendar[i].date.getMonth() &&
              eventStartDate.getDate() === newCalendar[i].date.getDate(),
            isEnd: eventEndDate.getDate() === newCalendar[i].date.getDate(),
            leftDuration: endIndex - i,
            editbale:
              editableCalendar.find((calendar) => calendar.id === event.calendarId)
                ?.allowsModifications || false,
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
    console.log(status);

    if (status === 'granted') {
      setGranted(true);
      let calendars = await getCalendarsAsync(EntityTypes.EVENT);
      const editableCalendars = calendars.filter(
        (calendar) => calendar.allowsModifications === true,
      );
      setEditableCalendar(editableCalendars);
      /**
       * 디바이스에서 캘린더들을 가져와 기존 zustand에 calendarLinks에 등록되지 않은 캘린더면 새로 등록하고 true 값을 넣는다.
       * 이것은 새로 생긴 캘린더들은 기본적으로 듀팅 캘린더에 연동되는 것을 의미한다. 이미 이전에 정의된 캘린더는 그대로 둔다.
       * */
      // const editable = calendars.filter((calendar) => calendar.)
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
    } else {
      Alert.alert(
        '권한 거부됨',
        '캘린더 접근 권한이 거부되었습니다. 설정에서 권한을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          // 설정으로 이동하는 버튼
          {
            text: '설정으로 이동',
            onPress: () => {
              if (Platform.OS === 'ios') Linking.openURL('app-settings:');
              else Linking.openSettings();
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    getPermissionFromDevice();
  }, []);

  useEffect(() => {
    if (granted && isCalendarChanged) {
      console.log('hi');
      getPermissionFromDevice();
      setDeivceCalendar('isChanged', false);
    }
  }, [granted, isCalendarChanged]);

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
