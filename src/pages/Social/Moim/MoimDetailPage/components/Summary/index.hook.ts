import { useMoimStore } from '@pages/Social/Moim/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccountStore } from 'store/account';
import { useCaledarDateStore } from 'store/calendar';
import { useShiftTypeStore } from 'store/shift';

const useSummary = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [selectedShiftType, setSelectedShiftType] = useState<number>(
    shiftTypes.keys().next().value,
  );
  const [page, setPage] = useState(0);
  const [account] = useAccountStore((state) => [state.account]);
  const [weeks, initCalendar] = useMoimStore((state) => [state.weeks, state.initCalendar]);
  const pressShiftTypeHandler = (id: number) => {
    setSelectedShiftType(id);
  };

  const threeDates = useMemo(() => {
    const prevDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return [prevDate, date, nextDate];
  }, [date]);

  useEffect(() => {
    initCalendar(date.getFullYear(), date.getMonth());
  }, [date.getFullYear(), date.getMonth()]);

  return {
    states: { date, shiftTypes, page, selectedShiftType, account, weeks, threeDates },
    actions: { pressShiftTypeHandler, setPage, setState },
  };
};

export default useSummary;
