import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { DateType } from '../Calendar';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { screenWidth } from 'index.style';
import { useLinkProps } from '@react-navigation/native';
import { isSameDate } from '@libs/utils/date';

const useScheduleCard = () => {
  const [date, calendar, setDateOnThread, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setDateOnThread,
    state.setState,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [selectedDateData, setSelectedDateData] = useState<DateType>();
  const { onPress: onPressAddScheduleButton } = useLinkProps({ to: { screen: 'RegistSchedule' } });

  const findDate = () => {
    const thisDate = calendar.find((cell) => isSameDate(cell.date, date));
    setSelectedDateData(thisDate);
  };

  useEffect(() => {
    findDate();
  }, [date, calendar]);

  const isToday = isSameDate(date, new Date());

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateString = nextDate.toISOString();

  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateString = prevDate.toISOString();

  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -offset.value }],
    };
  });

  const panGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -35) {
      runOnJS(setDateOnThread)(nextDateString);
      offset.value = withTiming(offset.value + screenWidth * 0.84, { duration: 360 }, () => {
        offset.value = 0;
      });
    } else if (e.translationX > 35) {
      runOnJS(setDateOnThread)(prevDateString);
      offset.value = withTiming(offset.value - screenWidth * 0.84, { duration: 360 }, () => {
        offset.value = 0;
      });
    }
  });

  const backDropPressHandler = () => {
    setState('isCardOpen', false);
  };

  const addButtonPressHandler = () => {
    onPressAddScheduleButton();
  };

  return {
    state: { animatedStyles, panGesture, date, selectedDateData, shiftTypes, isToday },
    actions: { backDropPressHandler, addButtonPressHandler },
  };
};

export default useScheduleCard;
