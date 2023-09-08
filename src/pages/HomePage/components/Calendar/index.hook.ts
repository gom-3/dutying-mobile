import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { shallow } from 'zustand/shallow';
import { DateType } from '.';
import { useQuery } from '@tanstack/react-query';
import { getAccountShiftList } from '@libs/api/shift';
import { useAccountStore } from 'store/account';

const memoizedCalendars = new Map();

const useCalendar = () => {
  const [userId] = useAccountStore((state) => [state.userId]);
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes], shallow);
  const [weeks, setWeeks] = useState<DateType[][]>([]);
  const today = new Date();
  const getAccountShiftListKey = [
    'getAccountShiftList',
    userId,
    date.getFullYear(),
    date.getMonth(),
  ];

  const { data: shiftListResponse } = useQuery(getAccountShiftListKey, () =>
    getAccountShiftList(userId, date.getFullYear(), date.getMonth()),
  );

  const dateClickHandler = (date: Date) => {
    setState('date', date);
    setState('isCardOpen', true);
  };

  const initCalendar = (year: number, month: number) => {
    const key = `${year}-${month}`;

    // if (memoizedCalendars.has(key)) {
    //   setState('calendar', memoizedCalendars.get(key));
    //   return;
    // }

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const calendar: DateType[] = [];
    let dateIndex = 0;
    if (shiftListResponse) {
      const shiftList = shiftListResponse.accountShiftTypeIdList;
      for (let i = first.getDay() - 1; i >= 0; i--) {
        const date: DateType = {
          date: new Date(year, month, -i),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      for (let i = 1; i <= last.getDate(); i++) {
        const date: DateType = {
          date: new Date(year, month, i),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
        const date: DateType = {
          date: new Date(year, month + 1, j),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      setState('calendar', calendar);
      setState('isCalendarReady', true);
      memoizedCalendars.set(key, calendar);
    }
  };

  useEffect(() => {
    if (calendar.length > 0) {
      const tempCalendar = [...calendar];
      const weeks = [];
      while (tempCalendar.length > 0) weeks.push(tempCalendar.splice(0, 7));
      setWeeks(weeks);
    }
  }, [calendar]);
  console.log(calendar);
  useEffect(() => {
    initCalendar(date.getFullYear(), date.getMonth());
  }, [date.getFullYear(), date.getMonth(), shiftListResponse]);

  return { state: { weeks, shiftTypes, date, today }, actions: { dateClickHandler } };
};

export default useCalendar;
