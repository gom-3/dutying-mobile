import { useShiftTypeStore } from 'store/shift';
import { useCaledarDateStore } from 'store/calendar';
import { useLinkProps } from '@react-navigation/native';
import { useScheduleStore } from 'store/schedule';
import { Schedule } from '@hooks/useDeviceCalendar';
import { firebaseLogEvent } from '@libs/utils/event';
import { useEffect, useRef } from 'react';
import { isSameDate } from '@libs/utils/date';
import { BackHandler, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const useScheduleCard = () => {
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

  useEffect(() => {
    const index = calendar.findIndex((c) => isSameDate(c.date, date));
    carouselRef?.current?.scrollTo({ index, animated: false });
  }, [calendar]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setState('isCardOpen', false);
      return true;
    });
    return () => {
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
      backHandler.remove();
    };
  }, []);

  return {
    state: {
      carouselRef,
      cardDefaultIndex,
      calendar,
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
