import { useDeviceCalendarStore } from "store/device";

const useCategory = () => {
  const [deviceCalendar] = useDeviceCalendarStore((state) => [state.dutyingCalendars]);
  return {states:{}, actions:{}};
};

export default useCategory;