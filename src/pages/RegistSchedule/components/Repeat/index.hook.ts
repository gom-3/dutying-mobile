import { useEffect, useState } from 'react';
import { useScheduleStore } from 'store/schedule';

const useRepeat = (openModal: () => void) => {
  const [using, setUsing] = useState(false);
  const [recurrenceRuleText] = useScheduleStore((state) => [state.recurrenceRuleText]);

  useEffect(() => {
    if (using) openModal();
  }, [using]);
  return { states: { using, recurrenceRuleText }, actions: { setUsing } };
};

export default useRepeat;
