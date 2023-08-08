import { useEffect } from 'react';
import * as Calendar from 'expo-calendar';
import { useCaledarDateStore } from 'store/calendar';

const useDeviceCalendar = () => {
  const [date, calendar, isCalendarReady, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.isCalendarReady,
    state.setState,
  ]);

  const getPermissionFromDevice = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === 'granted') {
      const year = date.getFullYear();
      const month = date.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      // const startDate = new Date(year, month, -(first.getDay() - 1)); 전달 까지 범위 확대
      // const endDate = new Date(year, month + 1, 6 - last.getDay()); 다음달 까지 범위 확대

      const events = await Calendar.getEventsAsync(['1', '2', '3', '5'], first, last);
      const newCalendar = [...calendar];

      events.forEach((event) => {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);
        const startIndex = first.getDay() + eventStartDate.getDate() - 1;
        let level;
        if (event.allDay) {
          const schedules = [...newCalendar[startIndex].schedules];
          const occupiedLevels = new Set(schedules.map((schedule) => schedule.level));
          level = 1;
          while (occupiedLevels.has(level)) {
            level++;
          }
          const schedule: Schedule = {
            name: event.title,
            color: 'yellow',
            startTime: eventStartDate,
            endTime: eventEndDate,
            level,
            isStart: true,
            isEnd: true,
          };
          schedules.push(schedule);
          newCalendar[startIndex].schedules = schedules;
        } else {
          let endIndex = first.getDay() + eventEndDate.getDate() - 1;
          if (endIndex > newCalendar.length - 1) endIndex = newCalendar.length - 1;
          const occupiedLevels = new Set();
          for (let i = startIndex; i <= endIndex; i++) {
            const schedules = newCalendar[i].schedules;
            schedules.forEach((schedule) => occupiedLevels.add(schedule.level));
          }

          level = 1;
          while (occupiedLevels.has(level)) {
            level++;
          }

          for (let i = startIndex; i <= endIndex; i++) {
            const schedule: Schedule = {
              name: event.title,
              color: '#5AF8F8',
              startTime: eventStartDate,
              endTime: eventEndDate,
              level,
              isStart: eventStartDate.getDate() === newCalendar[i].date.getDate(),
              isEnd: eventEndDate.getDate() === newCalendar[i].date.getDate(),
            };
            const schedules = [...newCalendar[i].schedules];
            schedules.push(schedule);
            newCalendar[i].schedules = schedules;
          }
        }
      });
      setState('calendar', newCalendar);
    }
  };

  useEffect(() => {
    if (isCalendarReady) {
      getPermissionFromDevice();
      setState('isCalendarReady', false);
    }
  }, [isCalendarReady]);
};

export default useDeviceCalendar;
