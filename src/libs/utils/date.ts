export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const days = ['일', '월', '화', '수', '목', '금', '토'];