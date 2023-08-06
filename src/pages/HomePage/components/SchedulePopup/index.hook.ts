import { useState } from 'react';

const useSchedulePopup = () => {
  const [isTimeEnable, setIsTimeEnable] = useState(false);
  const [isAlarmEnable, setIsAlarmEnable] = useState(false);
  const [isRepeatEnable, setIsRepeatEnable] = useState(false);

  return {
    state: { isTimeEnable, isAlarmEnable, isRepeatEnable },
    actions: { setIsRepeatEnable, setIsAlarmEnable, setIsTimeEnable },
  };
};

export default useSchedulePopup;
