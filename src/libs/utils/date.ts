export const isSameDate = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
};

export const days = ['일', '월', '화', '수', '목', '금', '토'];

export const yearMonthToDateString = (year: number, month: number) => {
  const startDay = new Date(year, month, 1).getDay() - 1;
  const endDay = new Date(year, month + 1, 1).getDay();
  const startDate = new Date(year, month, -startDay);
  const endDate = new Date(year, month + 1, endDay + 1);
  const startDateString = dateToString(startDate);
  const endDateString = dateToString(endDate);
  return [startDateString, endDateString];
};

export const monthRangeString = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const startDateString = dateToString(startDate);
  const endDateString = dateToString(endDate);
  return [startDateString, endDateString];
};

export const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

export const getCurrentWeekIndex = (date: Date, weeks: Date[][]) => {
  let index = -1;

  a: for (let i = 0; i < weeks.length; i++) {
    for (let j = 0; j < weeks[i].length; j++) {
      if (isSameDate(weeks[i][j], date)) {
        index = i;
        break a;
      }
    }
  }

  return index;
};

export const dateDiffInDays = (date1: Date, date2: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return Math.floor((utc2 - utc1) / msPerDay);
};

export const initMonthCalendarDates = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const calendar: Date[] = [];
  for (let i = first.getDay() - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    calendar.push(date);
  }
  for (let i = 1; i <= last.getDate(); i++) {
    const date = new Date(year, month, i);
    calendar.push(date);
  }
  for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
    const date = new Date(year, month + 1, j);
    calendar.push(date);
  }
  const weeks: Date[][] = [];
  while (calendar.length > 0) weeks.push(calendar.splice(0, 7));
  return weeks;
};
