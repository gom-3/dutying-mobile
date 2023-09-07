import { DateType } from '@pages/HomePage/components/Calendar';
import { useShiftTypeStore } from 'store/shift';
import { useEffect, useState } from 'react';
import { useCaledarDateStore } from 'store/calendar';
import { isSameDate } from '@libs/utils/date';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';

const useRegistDuty = () => {
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [shiftTypesCount, setShiftTypesCount] = useState(new Map<number, number>());
  const [tempCalendar, setTempCalendar] = useState<DateType[]>([]);
  const [weeks, setWeeks] = useState<DateType[][]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1),
  );
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    setTempCalendar([...calendar]);
    setIndex(calendar.findIndex((t) => isSameDate(t.date, selectedDate)));
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
      shift: null,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar(newArray);
  };

  const selectDate = (e: Date) => {
    if (e.getMonth() === date.getMonth()) {
      setSelectedDate(e);
      setIndex(tempCalendar.findIndex((t) => isSameDate(t.date, e)));
    }
  };

  const saveRegistDutyChange = () => {
    setState('isSideMenuOpen', false);
    setState('calendar', [...tempCalendar]);
    navigation.goBack();
  };

  useEffect(() => {
    if (tempCalendar.length > 0) {
      initCalendar();
    }
  }, [tempCalendar]);

  useEffect(() => {
    if (tempCalendar) {
      const map = new Map<number, number>();
      tempCalendar.forEach((date) => {
        if (date.shift) {
          const value = map.get(date.shift) || 0;
          map.set(date.shift, value + 1);
        }
      });
      setShiftTypesCount(map);
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
      selectDate,
      saveRegistDutyChange,
    },
  };
};

export default useRegistDuty;
