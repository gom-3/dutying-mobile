import { useShiftTypeStore } from 'store/shift';
import { useEffect, useMemo, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { shallow } from 'zustand/shallow';
import { DateType } from '.';
import { useQuery } from '@tanstack/react-query';
import { getAccountShiftList } from '@libs/api/shift';
import { useAccountStore } from 'store/account';
import {
  HandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import analytics from '@react-native-firebase/analytics';
import { firebaseLogEvent } from '@libs/utils/event';

const useCalendar = (isRender?: boolean) => {
  const [account, userId] = useAccountStore((state) => [state.account, state.account.accountId]);
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes], shallow);
  const today = new Date();
  const getAccountShiftListKey = [
    'getAccountShiftList',
    userId,
    date.getFullYear(),
    date.getMonth(),
  ];

  const { data: shiftListResponse } = useQuery(
    getAccountShiftListKey,
    () => getAccountShiftList(userId, date.getFullYear(), date.getMonth()),
    {
      enabled: userId > 0,
    },
  );

  const dateClickHandler = (date: Date) => {
    firebaseLogEvent('select_date_cell');
    setState('date', date);
    setState('isCardOpen', true);
  };

  const initCalendar = (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const calendar: DateType[] = [];
    let dateIndex = 0;
    if (shiftListResponse) {
      console.log(shiftListResponse)
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
      setState('isScheduleUpdated', true);
    }
  };

  const weeks = useMemo(() => {
    const weeks: DateType[][] = [];
    if (isRender) {
      const temp = [...calendar];
      while (temp.length > 0) weeks.push(temp.splice(0, 7));
    }
    return weeks;
  }, [calendar]);

  useEffect(() => {
    initCalendar(date.getFullYear(), date.getMonth());
  }, [date.getFullYear(), date.getMonth(), shiftListResponse]);

  const onHandlerStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.translationX > 100) {
        firebaseLogEvent('swipe_calendar');
        const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setState('date', prevMonth);
      } else if (event.nativeEvent.translationX < -100) {
        firebaseLogEvent('swipe_calendar');
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setState('date', nextMonth);
      }
    }
  };

  return {
    state: { weeks, shiftTypes, date, today },
    actions: { dateClickHandler, onHandlerStateChange },
  };
};

export default useCalendar;
