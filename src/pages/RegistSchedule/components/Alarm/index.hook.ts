import { useEffect, useState } from 'react';
import { useScheduleStore } from 'store/schedule';

const useAlarm = (openModal: () => void) => {
  const [using, setUsing] = useState(false);
  const [alarmText] = useScheduleStore((state) => [state.alarmText]);

  useEffect(() => {
    if (using) openModal();
  }, [using]);
  return { states: { using, alarmText }, actions: { setUsing } };
};

export default useAlarm;
