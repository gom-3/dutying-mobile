import { useScheduleStore } from 'store/schedule';

const useRepeat = (openModal: () => void) => {
  const [isRecurrenceUsing, recurrenceRuleText, setState] = useScheduleStore((state) => [
    state.isRecurrenceUsing,
    state.recurrenceRuleText,
    state.setState,
  ]);

  const setIsRecurrenceUsing = (value: boolean) => {
    setState('isRecurrenceUsing', value);
    if (value) openModal();
  };

  return { states: { isRecurrenceUsing, recurrenceRuleText }, actions: { setIsRecurrenceUsing } };
};

export default useRepeat;
