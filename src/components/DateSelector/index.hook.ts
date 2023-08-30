import { useCaledarDateStore } from 'store/calendar';

const useDateSelector = () => {
  const [date, isDateSelectorOpen, setState] = useCaledarDateStore((state) => [
    state.date,
    state.isDateSelectorOpen,
    state.setState,
  ]);

  const closeDateSelector = () => {
    setState('isDateSelectorOpen', false);
  };

  const yearClickHandler = (year: number) => {
    if (year !== date.getFullYear()) {
      const newDate = new Date(year, date.getMonth(), date.getDate());
      setState('date', newDate);
    }
  };

  const monthClickHandler = (month: number) => {
    if (month !== date.getMonth()) {
      const newDate = new Date(date.getFullYear(), month, 1);
      setState('date', newDate);
    }
  };

  const dateViewClickHander = () => {
    setState('isDateSelectorOpen', !isDateSelectorOpen);
  };

  return {
    state: { date, isDateSelectorOpen },
    actions: { closeDateSelector, yearClickHandler, monthClickHandler, dateViewClickHander },
  };
};

export default useDateSelector;
