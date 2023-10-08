import { useMoimStore } from '@pages/Social/Moim/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccountStore } from 'store/account';
import { useCaledarDateStore } from 'store/calendar';
import { useShiftTypeStore } from 'store/shift';

// type SummaryClassification = 'day' | 'evening' | 'night' | 'off';

const useSummary = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [selectedShiftType, setSelectedShiftType] = useState<number>(
    shiftTypes.keys().next().value,
  );
  const [page, setPage] = useState(0);
  const [account] = useAccountStore((state) => [state.account]);
  const [weeks, initCalendar] = useMoimStore((state) => [state.weeks, state.initCalendar]);

  const [selectedClassification, setSelectedClassification] = useState<string>('off');

  const pressShiftTypeHandler = (text: string, shiftId:number) => {
    setSelectedClassification(text);
    setSelectedShiftType(shiftId);
  };

  const [index, setIndex] = useState(10);
  const threeDates = useMemo(() => {
    const prevDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return [prevDate, date, nextDate];
  }, [date]);

  

  useEffect(() => {
    initCalendar(date.getFullYear(), date.getMonth());
  }, [date.getFullYear(), date.getMonth()]);

  const pressDate = (day: Date, i: number) => {
    setState('date', day);
    setIndex(i);
  };

  return {
    states: {
      selectedClassification,
      index,
      date,
      shiftTypes,
      page,
      selectedShiftType,
      account,
      weeks,
      threeDates,
    },
    actions: { pressShiftTypeHandler, setPage, pressDate, setState },
  };
};

export default useSummary;
