import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { useLinkProps } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

const useCalendarHeader = () => {
  const [calendar, setState] = useCaledarDateStore((state) => [state.calendar, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [shiftTypesCount, setShiftTypesCount] = useState(new Map<number, number>());
  const { onPress } = useLinkProps({ to: { screen: 'Notification' } });

  const navigateToNotification = () => {
    analytics().logEvent('move_notification');
    onPress();
  };

  const openSideMenu = () => {
    analytics().logEvent('open_sidemenu');
    setState('isSideMenuOpen', true);
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
    actions: { navigateToNotification, openSideMenu },
  };
};

export default useCalendarHeader;
