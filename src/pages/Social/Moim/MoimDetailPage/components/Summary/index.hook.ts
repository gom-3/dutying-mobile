import { isSameDate } from '@libs/utils/date';
import { useMoimStore } from '@pages/Social/Moim/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccountStore } from 'store/account';
import { useCaledarDateStore } from 'store/calendar';
import { useShiftTypeStore } from 'store/shift';

// type SummaryClassification = 'day' | 'evening' | 'night' | 'off';

interface Props {
  collection: Collection;
}

const useSummary = ({ collection }: Props) => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [page, setPage] = useState(0);
  const [account] = useAccountStore((state) => [state.account]);
  const [weeks, initCalendar] = useMoimStore((state) => [state.weeks, state.initCalendar]);

  const [selectedClassification, setSelectedClassification] = useState<string>('off');
  const selectedShiftTypeName = Array.from(shiftTypes.values()).find(
    (shift) => shift.classification === selectedClassification.toUpperCase(),
  );

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

  const getIndexFromDate = (date: Date) => {
    weeks.forEach((week, i) =>
      week.forEach((day, j) => {
        if (isSameDate(day, date)) setIndex(i * 7 + j);
      }),
    );
  };

  let summary: Summary[];
  switch (selectedClassification) {
    case 'day':
      summary = collection.summaryView.day;
      break;
    case 'evening':
      summary = collection.summaryView.evening;
      break;
    case 'night':
      summary = collection.summaryView.night;
      break;
    default:
      summary = collection.summaryView.off;
  }

  const datas = summary;
  const summaryDate = summary.length > 0 ? new Date(summary[page].date) : date;

  const pressShiftTypeHandler = (text: string) => {
    setSelectedClassification(text);
  };

  return {
    states: {
      selectedClassification,
      index,
      date,
      shiftTypes,
      page,
      summaryDate,
      selectedShiftTypeName,
      account,
      datas,
      summary,
      weeks,
      threeDates,
    },
    actions: { pressShiftTypeHandler, setPage, pressDate, setState, setIndex, getIndexFromDate },
  };
};

export default useSummary;
