import { useScheduleStore } from 'store/schedule';

const useAlarm = (openModal: () => void) => {
  const [isAlarmUsing, alarmText, setState] = useScheduleStore((state) => [
    state.isAlarmUsing,
    state.alarmText,
    state.setState,
  ]);
  const setIsAlarmUsing = (value: boolean) => {
    setState('isAlarmUsing', value);
    if (value) openModal();
  };

  return { states: { isAlarmUsing, alarmText }, actions: { setIsAlarmUsing } };
};

export default useAlarm;
