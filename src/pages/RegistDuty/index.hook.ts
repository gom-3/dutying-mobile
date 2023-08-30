import { DateType } from '@pages/HomePage/components/Calendar';
import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';

const useCalendar = () => {
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [shiftTypesCount, setShiftTypesCount] = useState(
    Array.from({ length: shiftTypes.length }, () => 0),
  );
  const [tempCalendar, setTempCalendar] = useState<DateType[]>([]);
  const [weeks, setWeeks] = useState<DateType[][]>([]);
  const [index, setIndex] = useState(3);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setTempCalendar([...calendar]);
  }, [calendar]);

  useEffect(() => {
    if (tempCalendar[index]) setSelectedDate(tempCalendar[index].date);
  }, [index]);

  const initCalendar = () => {
    const weeks = [];
    const temp = [...tempCalendar];
    while (temp.length > 0) weeks.push(temp.splice(0, 7));
    setWeeks(weeks);
  };

  const insertShift = (shift: number) => {
    const newValue: DateType = {
      ...tempCalendar[index],
      shift,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar([...newArray]);
    if (tempCalendar[index + 1].date.getMonth() === tempCalendar[index].date.getMonth()) {
      setIndex(index + 1);
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1),
      );
    }
  };

  const deleteShift = () => {
    const newValue: DateType = {
      ...tempCalendar[index],
      shift: undefined,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar(newArray);
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const selectDate = (e: Date) => {
    if (e.getMonth() === date.getMonth()) {
      setSelectedDate(e);
      setIndex(tempCalendar.findIndex((t) => isSameDate(t.date, e)));
    }
  };

  const saveRegistDutyChange = () => {
    setState('calendar', [...tempCalendar]);
  };

  useEffect(() => {
    if (tempCalendar.length > 0) {
      initCalendar();
    }
  }, [tempCalendar]);

  useEffect(() => {
    if (tempCalendar) {
      const newArray = Array.from({ length: shiftTypes.length }, () => 0);
      tempCalendar.forEach((cell) => {
        if (cell.date.getMonth() === date.getMonth() && cell.shift !== undefined) {
          newArray[cell.shift] = newArray[cell.shift] + 1;
        }
      });
      setShiftTypesCount(newArray);
    }
  }, [tempCalendar]);

  return {
    state: {
      date,
      weeks,
      selectedDate,
      shiftTypes,
      shiftTypesCount,
    },
    actions: {
      insertShift,
      deleteShift,
      isSameDate,
      selectDate,
      saveRegistDutyChange,
    },
  };
};

export default useCalendar;
