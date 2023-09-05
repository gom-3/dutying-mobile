type AlarmInfo = {
  accountShiftAlarmId: number;
  alarmTime: string;
  isPush: boolean;
  isDeleted: boolean;
};

type Shift = {
  accountShiftTypeId: number;
  name: string;
  shortName: string;
  color: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
  isDefault: boolean;
  classification: '데이' | '이브닝' | '나이트' | 'ELSE' | '오프' | 'LEAVE';
  isAlarm: boolean;
  alarmInfoList: AlarmInfo[];
};
