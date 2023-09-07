import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';

const useCalendarHeader = () => {
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [shiftTypesCount, setShiftTypesCount] = useState(new Map<number, number>());

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
    states: { date, shiftTypes, shiftTypesCount },
    actions: { setState },
  };
};

export default useCalendarHeader;
