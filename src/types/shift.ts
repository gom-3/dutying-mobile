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
  startTime: Date | null;
  endTime: Date | null;
  isDefault: boolean;
  classification: 'DAY' | 'EVENING' | 'NIGHT' | 'OTHER_WORK' | 'OFF' | 'LEAVE' | 'OTHER_LEAVE';
  isAlarm: boolean;
  alarmInfoList: AlarmInfo[];
};