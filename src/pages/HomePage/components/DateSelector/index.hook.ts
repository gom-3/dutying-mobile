import { useCaledarDateStore } from 'store/calendar';
import { shallow } from 'zustand/shallow';

const useDateSelector = () => {
  const [date, setState] = useCaledarDateStore((state) => [state.date, state.setState], shallow);

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

  return { state: { date }, actions: { closeDateSelector, yearClickHandler, monthClickHandler } };
};

export default useDateSelector;
