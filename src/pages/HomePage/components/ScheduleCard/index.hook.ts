import { useShiftTypeStore } from 'store/shift';
import { useCaledarDateStore } from 'store/calendar';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { screenWidth } from 'index.style';
import { useLinkProps } from '@react-navigation/native';
import { isSameDate } from '@libs/utils/date';
import { useScheduleStore } from 'store/schedule';
import { Schedule } from '@hooks/useDeviceCalendar';
import { firebaseLogEvent } from '@libs/utils/event';

const useScheduleCard = () => {
  const [date, calendar, setDateOnThread, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setDateOnThread,
    state.setState,
  ]);
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

  const selectedDateData = calendar.findIndex((cell) => isSameDate(cell.date, date));

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
      offset.value = withSequence(
        withTiming(offset.value + screenWidth * 0.84, { duration: 300 }, () => {
          runOnJS(setDateOnThread)(nextDateString);
        }),
        withDelay(150, withTiming(0, { duration: 0 })),
      );
    } else if (e.translationX > 35) {
      offset.value = withSequence(
        withTiming(offset.value - screenWidth * 0.84, { duration: 300 }, () => {
          runOnJS(setDateOnThread)(prevDateString);
        }),
        withDelay(150, withTiming(0, { duration: 0 })),
      );
    }
  });

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
    firebaseLogEvent('move_edit_schedule');
    initStateEdit(schedule);
    onPressEditScheduleButton();
  };

  return {
    state: { calendar, animatedStyles, panGesture, date, selectedDateData, shiftTypes, isToday },
    actions: {
      editShiftPressHandler,
      backDropPressHandler,
      addSchedulePressHandler,
      editSchedulePressHandler,
    },
  };
};

export default useScheduleCard;
