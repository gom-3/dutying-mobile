import { useShiftTypeStore } from 'store/shift';
import { useCaledarDateStore } from 'store/calendar';
import { useLinkProps } from '@react-navigation/native';
import { useScheduleStore } from 'store/schedule';
import { Schedule } from '@hooks/useDeviceCalendar';
import { firebaseLogEvent } from '@libs/utils/event';
import { useEffect, useMemo, useRef } from 'react';
import { isSameDate } from '@libs/utils/date';
import { BackHandler, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const useScheduleCard = (isCardOpen: boolean) => {
  const [date, calendar, setDateOnThread, cardDefaultIndex, setState] = useCaledarDateStore(
    (state) => [
      state.date,
      state.calendar,
      state.setDateOnThread,
      state.cardDefaultIndex,
      state.setState,
    ],
  );
  const [initStateCreate, initStateEdit] = useScheduleStore((state) => [
    state.initStateCreate,
    state.initStateEdit,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: onPressAddScheduleButton } = useLinkProps({ to: { screen: 'RegistSchedule' } });
  const { onPress: onPressEditScheduleButton } = useLinkProps({
    to: { screen: 'RegistSchedule', params: { isEdit: true } },
  });
  const { onPress: onPressRegistShiftButton } = useLinkProps({
    to: { screen: 'RegistDuty', params: { dateFrom: date.toISOString() } },
  });
  const carouselRef = useRef<any>(null);
  const nextDate = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth();
  nextDate.setDate(nextDate.getDate() + 1);

  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);

  const backDropPressHandler = () => {
    setState('isCardOpen', false);
  };

  const editShiftPressHandler = () => {
    firebaseLogEvent('move_regist_duty_specific');
    onPressRegistShiftButton();
  };

  const addSchedulePressHandler = () => {
    firebaseLogEvent('move_regist_schedule');
    initStateCreate(date);
    onPressAddScheduleButton();
  };

  const editSchedulePressHandler = (schedule: Schedule) => {
    if (schedule.editbale) {
      firebaseLogEvent('move_edit_schedule');
      initStateEdit(schedule);
      onPressEditScheduleButton();
    }
  };

  const changeDate = (index: number) => {
    const newDate = new Date(calendar[index].date);
    setState('date', newDate);
  };

  const thisMonthDefaultIndex = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    return cardDefaultIndex - first;
  }, [cardDefaultIndex]);

  const thisMonthCalendar = useMemo(() => {
    return calendar.filter((cell) => cell.date.getMonth() === date.getMonth());
  }, [calendar]);

  useEffect(() => {
    const first = new Date(year, month, 1).getDay();
    const index = calendar.findIndex((c) => isSameDate(c.date, date));
    carouselRef?.current?.scrollTo({ index: index - first, animated: false });
  }, [calendar]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    return () => {
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  useEffect(() => {
    if (isCardOpen)
      BackHandler.addEventListener('hardwareBackPress', () => {
        setState('isCardOpen', false);
        return true;
      });
    else
      BackHandler.removeEventListener('hardwareBackPress', () => {
        setState('isCardOpen', false);
        return true;
      });
  }, [isCardOpen]);

  return {
    state: {
      carouselRef,
      thisMonthDefaultIndex,
      thisMonthCalendar,
      shiftTypes,
    },
    actions: {
      editShiftPressHandler,
      backDropPressHandler,
      addSchedulePressHandler,
      editSchedulePressHandler,
      changeDate,
    },
  };
};

export default useScheduleCard;
