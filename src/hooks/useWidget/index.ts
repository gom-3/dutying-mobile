import { getItem, reloadAll, setItem } from '../../../modules/widget';
import { useEffect, useState } from 'react';
import { DateType } from '@pages/HomePage/components/Calendar';
import { handleWidgetData } from './handler';
import { useQuery } from '@tanstack/react-query';
import { getAccountShiftList } from '@libs/api/shift';
import { useAccountStore } from 'store/account';
import { useDeviceCalendarStore } from 'store/device';
import { Platform } from 'react-native';
import { getEventsAsync } from 'expo-calendar';
import { dateDiffInDays } from '@libs/utils/date';
import { Schedule } from '@hooks/useDeviceCalendar';

const GROUP_NAME = 'group.expo.modules.widgetsync.data';

const getSharedData = getItem(GROUP_NAME);
const setSharedData = setItem(GROUP_NAME);

function useWidget({ shiftTypes }: { shiftTypes: Map<number, Shift> }) {
  const [userId] = useAccountStore((state) => [state.account.accountId]);
  const [deviceCalendar, calendarLinks, isCalendarChanged, setDeivceCalendar] =
    useDeviceCalendarStore((state) => [
      state.calendars,
      state.calendarLink,
      state.isChanged,
      state.setState,
    ]);
  const [widgetData, setWidgetData] = useState(getSharedData(GROUP_NAME) ?? '');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { data: shiftListResponse } = useQuery(
    ['shiftForwidget', year, month],
    () => getAccountShiftList(userId, year, month),
    {
      enabled: userId > 0,
    },
  );

  const getEventFromDevice = async (calendar: DateType[]) => {
    const first = new Date(year, month, 1);
    const last =
      Platform.OS === 'android' ? new Date(year, month + 1, 10) : new Date(year, month + 1, 1);
    const idList = deviceCalendar
      .filter((calendar) => calendarLinks[calendar.id])
      .map((calendar) => calendar.id);
    if (idList.length === 0) return;
    let events = await getEventsAsync(idList, first, last);
    if (Platform.OS === 'android') {
      events = events.filter((event) => new Date(event.startDate).getMonth() === month);
    }
    const newCalendar = [...calendar];
    newCalendar.forEach((date) => (date.schedules = []));
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
      if (eventEndDate.getMonth() > month || eventEndDate.getFullYear() > year)
        endIndex += new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), 0).getDate();

      if (eventStartDate.getMonth() < month || eventStartDate.getFullYear() < year)
        startIndex -= new Date(year, month + 1, 0).getDate();

      if (endIndex > newCalendar.length - 1) endIndex = newCalendar.length - 1;
      let index = Math.max(0, startIndex);
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
          const schedule = {
            ...event,
            startTime: eventStartDate,
            endTime: eventEndDate,
            color: color,
          } as Schedule;
          const schedules = [...newCalendar[i].schedules];
          schedules.push(schedule);
          newCalendar[i].schedules = schedules;
        }
        index = index + jump;
      }
    });
    return newCalendar;
  };

  const initCalendar = async (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    let calendar: DateType[] = [];
    let dateIndex = 0;

    const shiftList = shiftListResponse?.accountShiftTypeIdList;
    for (let i = first.getDay() - 1; i >= 0; i--) {
      const date: DateType = {
        date: new Date(year, month, -i),
        shift: shiftList ? shiftList[dateIndex++] : null,
        schedules: [],
      };
      calendar.push(date);
    }
    for (let i = 1; i <= last.getDate(); i++) {
      const date: DateType = {
        date: new Date(year, month, i),
        shift: shiftList ? shiftList[dateIndex++] : null,
        schedules: [],
      };
      calendar.push(date);
    }
    for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
      const date: DateType = {
        date: new Date(year, month + 1, j),
        shift: shiftList ? shiftList[dateIndex++] : null,
        schedules: [],
      };
      calendar.push(date);
    }

    calendar = (await getEventFromDevice(calendar)) || calendar;

    const weeks: DateType[][] = [];
    const temp = [...calendar];
    while (temp.length > 0) weeks.push(temp.splice(0, 7));

    const widgetData = handleWidgetData(year, month + 1, weeks, shiftTypes);
    setWidgetData(JSON.stringify(widgetData));
  };

  useEffect(() => {
    if (shiftListResponse && shiftTypes) {
      initCalendar(year, month);
    }
  }, [year, month, shiftListResponse, shiftTypes]);

  useEffect(() => {
    setSharedData('savedData', widgetData);
    reloadAll();
  }, [widgetData]);
}

export default useWidget;
