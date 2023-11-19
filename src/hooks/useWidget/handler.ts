import { Schedule } from '@hooks/useDeviceCalendar';
import { DateType } from '@pages/HomePage/components/Calendar';

export type WidgetDateType = {
  day: string; //03
  dayName: string; //금
  dayType: 'saturday' | 'sunday' | 'workday';
};

export type WidgetShift = {
  name: string;
  shortName: string;
  color: number; // 0xFFFFFF
  time: string; // 10:00 ~ 18:00
};

export type WidgetSchedule = {
  title: string;
  color: number; // 0xFFFFFF
  time: string; // HH:mm ~ HH:mm | -
};

export type WidgetData = {
  today: {
    date: WidgetDateType;
    shift: WidgetShift | null;
    schedules: WidgetSchedule[];
    closeSchedule: WidgetSchedule | null;
  };
  week: {
    period: string; // mm.dd ~ mm.dd
    shiftList: {
      date: WidgetDateType;
      shift: WidgetShift | null;
      isCurrentMonth: boolean;
    }[];
  };
  month: {
    year: number;
    month: number;
    startDayIndex: number;
    endDayIndex: number;
    calendar: {
      date: WidgetDateType;
      shift: WidgetShift | null;
      isCurrentMonth: boolean;
    }[][];
  };
};

export const dateToHHMM = (date: Date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
};

export const getDayName = (date: Date) => {
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = week[date.getDay()];
  return dayOfWeek;
};

export const dateToWidgetDateType = (date: Date) => {
  return {
    day: date.getDate().toString(),
    dayName: getDayName(date),
    dayType: date.getDay() === 0 ? 'sunday' : date.getDay() === 6 ? 'saturday' : 'workday',
  } as WidgetDateType;
};

export const shiftIdToWidgetShiftData = (shiftTypes: Map<number, Shift>, shiftId: number) => {
  const shift = shiftTypes.get(shiftId);
  if (!shift) return null;
  const widgetShift: WidgetShift = {
    name: shift.name,
    shortName: shift.shortName,
    color: Number('0x' + shift.color.substring(1, shift.color.length)),
    time:
      shift.startTime === null || shift.endTime === null
        ? '-'
        : dateToHHMM(shift.startTime) + ' ~ ' + dateToHHMM(shift.endTime),
  };
  return widgetShift;
};

export const sheduleToWidgetSheduleData = (shedule: Schedule) => {
  if (!shedule) return null;
  return {
    title: shedule.title,
    color: Number('0x' + shedule.color.substring(1, shedule.color.length)),
    time: dateToHHMM(shedule.startTime) + ' ~ ' + dateToHHMM(shedule.endTime),
  } as WidgetSchedule;
};

export const findCloseSchedule = (schedules: Schedule[]) => {
  if (schedules.length === 0) return null;
  const now = new Date();
  const schedule = schedules
    .filter((x) => x.startTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
  return sheduleToWidgetSheduleData(schedule);
};

const makeMonth = (
  shiftList: {
    date: WidgetDateType;
    shift: WidgetShift | null;
    isCurrentMonth: boolean;
  }[],
) => {
  let arr: {
    date: WidgetDateType;
    shift: WidgetShift | null;
    isCurrentMonth: boolean;
  }[][] = [];
  for (let i = 0; i < shiftList.length / 7; i++) {
    arr = [...arr, shiftList.slice(7 * i, 7 * i + 7)];
  }
  return arr;
};

export const handleWidgetData = (
  year: number,
  month: number,
  weeks: DateType[][],
  shiftTypes: Map<number, Shift>,
) => {
  const now = new Date();
  const startDayIndex = new Date(year, month - 1, 1).getDay();
  const endDayIndex = new Date(year, month, 0).getDay();
  const todayDayType = weeks.flatMap((x) => x).find((x) => x.date.getDate() === now.getDate());
  const currentWeek = weeks.find((x) => x.some((y) => y.date.getDate() === now.getDate()));

  if (!todayDayType || !currentWeek) return;
  const widgetData: WidgetData = {
    today: {
      date: dateToWidgetDateType(now),
      shift:
        todayDayType && todayDayType.shift
          ? shiftIdToWidgetShiftData(shiftTypes, todayDayType.shift)
          : null,
      schedules: todayDayType.schedules
        .map((x) => sheduleToWidgetSheduleData(x))
        .filter((x) => x !== null) as WidgetSchedule[],
      closeSchedule: todayDayType ? findCloseSchedule(todayDayType.schedules) : null,
    },
    week: {
      period: `${currentWeek[0].date.getMonth() + 1}.${currentWeek[0].date.getDate()} ~ ${
        currentWeek[6].date.getMonth() + 1
      }.${currentWeek[6].date.getDate()}`,
      shiftList: currentWeek.map((x) => ({
        date: dateToWidgetDateType(x.date),
        shift: x.shift ? shiftIdToWidgetShiftData(shiftTypes, x.shift) : null,
        isCurrentMonth: x.date.getMonth() + 1 === month,
      })),
    },
    month: {
      year,
      month,
      startDayIndex,
      endDayIndex,
      calendar: makeMonth(
        weeks
          .flatMap((x) => x)
          .map((x) => ({
            date: dateToWidgetDateType(x.date),
            shift: x.shift ? shiftIdToWidgetShiftData(shiftTypes, x.shift) : null,
            isCurrentMonth: x.date.getMonth() + 1 === month,
          })),
      ),
    },
  };
  return widgetData;
};
