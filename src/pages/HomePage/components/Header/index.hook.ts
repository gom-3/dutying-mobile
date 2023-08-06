import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { shallow } from 'zustand/shallow';

const useCalendarHeader = () => {
  const [date, calendar, isDateSelectorOpen, setState] = useCaledarDateStore(
    (state) => [state.date, state.calendar, state.isDateSelectorOpen, state.setState],
    shallow,
  );
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes], shallow);
  const [shiftTypesCount, setShiftTypesCount] = useState(
    Array.from({ length: shiftTypes.length }, () => 0),
  );

  useEffect(() => {
    if (calendar) {
      const newArray = Array.from({ length: shiftTypes.length }, () => 0);
      calendar.forEach((cell) => {
        if (cell.date.getMonth() === date.getMonth() && cell.shift !== undefined) {
          newArray[cell.shift] = newArray[cell.shift] + 1;
        }
      });
      setShiftTypesCount(newArray);
    }
  }, [calendar]);

  const dateViewClickHander = () => {
    setState('isDateSelectorOpen', !isDateSelectorOpen);
  };

  return {
    state: { date, shiftTypes, shiftTypesCount },
    actions: { setState, dateViewClickHander },
  };
};

export default useCalendarHeader;
