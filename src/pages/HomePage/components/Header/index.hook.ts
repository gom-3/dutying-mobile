import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { useLinkProps } from '@react-navigation/native';

const useCalendarHeader = () => {
  const [calendar, setState] = useCaledarDateStore((state) => [state.calendar, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [shiftTypesCount, setShiftTypesCount] = useState(new Map<number, number>());
  const { onPress } = useLinkProps({ to: { screen: 'Notification' } });

  const navigateToNotification = () => {
    onPress();
  };

  useEffect(() => {
    if (calendar) {
      const map = new Map<number, number>();
      calendar.forEach((date) => {
        if (date.shift) {
          const value = map.get(date.shift) || 0;
          map.set(date.shift, value + 1);
        }
      });
      setShiftTypesCount(map);
    }
  }, [calendar]);

  return {
    states: { shiftTypes, shiftTypesCount },
    actions: { setState, navigateToNotification },
  };
};

export default useCalendarHeader;
