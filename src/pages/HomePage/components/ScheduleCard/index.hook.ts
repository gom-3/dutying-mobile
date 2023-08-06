import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { shallow } from 'zustand/shallow';
import { DateType } from '../Calendar';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { screenWidth } from 'index.style';

const useScheduleCard = () => {
  const [date, calendar, setDateOnThread, setState] = useCaledarDateStore(
    (state) => [state.date, state.calendar, state.setDateOnThread, state.setState],
    shallow,
  );
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [selectedDateData, setSelectedDateData] = useState<DateType>();

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const findDate = () => {
    const thisDate = calendar.find((cell) => isSameDate(cell.date, date));
    setSelectedDateData(thisDate);
  };

  useEffect(() => {
    findDate();
  }, [date]);

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
    if (e.translationX < 0) {
      runOnJS(setDateOnThread)(nextDateString);
      offset.value = withTiming(offset.value + screenWidth * 0.8, { duration: 200 }, () => {
        offset.value = 0;
      });
    } else {
      runOnJS(setDateOnThread)(prevDateString);
      offset.value = withTiming(offset.value - screenWidth * 0.8, { duration: 200 }, () => {
        offset.value = 0;
      });
    }
  });

  const backDropPressHandler = () => {
    setState('isCardOpen', false);
    setState('isPopupOpen', false);
  };

  const addButtonPressHandler = () => {
    setState('isPopupOpen', true);
  };

  return {
    state: { animatedStyles, panGesture, date, selectedDateData, shiftTypes, isToday },
    actions: { backDropPressHandler, addButtonPressHandler },
  };
};

export default useScheduleCard;
