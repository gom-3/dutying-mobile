import { MoimCollectionResponseDTO } from '@libs/api/moim';

export const isSameDate = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
};

export const days = ['일', '월', '화', '수', '목', '금', '토'];

export const yearMonthToDateString = (year: number, month: number) => {
  const startDay = new Date(year, month, 1).getDay() - 1;
  const endDay = new Date(year, month + 1, 1).getDay();
  const startDate = new Date(year, month, -startDay);
  const endDate = new Date(year, month + 1, endDay);
  const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
  const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
  return [startDateString, endDateString];
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
