type Collection = Pick<Account, 'accountId' | 'name' | 'profileImgBase64'> & {
  accountShiftTypes: Omit<Shift, 'shortName' | 'isDefault' | 'isAlarm' | 'alarmInfoList'>[];
  accountShiftTypeList: number[];
};

export const collections: Collection[] = [
  {
    accountId: 1,
    name: '김찬규',
    profileImgBase64: '',
    accountShiftTypes: [
      {
        accountShiftTypeId: 1,
        name: '데이',
        startTime: new Date(),
        endTime: new Date(),
        color: '#4dc2ad',
        classification: 'DAY',
      },
      {
        accountShiftTypeId: 2,
        name: '이브닝',
        startTime: new Date(),
        endTime: new Date(),
        color: '#ff8ba5',
        classification: 'EVENING',
      },
      {
        accountShiftTypeId: 3,
        name: '나이트',
        startTime: new Date(),
        endTime: new Date(),
        color: '#3580ff',
        classification: 'NIGHT',
      },
    ],
    accountShiftTypeList: [
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1,
      2, 3, 1, 2, 3, 1, 2, 3,
    ],
  },
  {
    accountId: 1,
    name: '황인서',
    profileImgBase64: '',
    accountShiftTypes: [
      {
        accountShiftTypeId: 1,
        name: '데이',
        startTime: new Date(),
        endTime: new Date(),
        color: '#4dc2ad',
        classification: 'DAY',
      },
      {
        accountShiftTypeId: 2,
        name: '이브닝',
        startTime: new Date(),
        endTime: new Date(),
        color: '#ff8ba5',
        classification: 'EVENING',
      },
      {
        accountShiftTypeId: 3,
        name: '나이트',
        startTime: new Date(),
        endTime: new Date(),
        color: '#3580ff',
        classification: 'NIGHT',
      },
    ],
    accountShiftTypeList: [
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1,
      2, 3, 1, 2, 3, 1, 2, 3,
    ],
  },
  {
    accountId: 1,
    name: '김범진',
    profileImgBase64: '',
    accountShiftTypes: [
      {
        accountShiftTypeId: 1,
        name: '데이',
        startTime: new Date(),
        endTime: new Date(),
        color: '#4dc2ad',
        classification: 'DAY',
      },
      {
        accountShiftTypeId: 2,
        name: '이브닝',
        startTime: new Date(),
        endTime: new Date(),
        color: '#ff8ba5',
        classification: 'EVENING',
      },
      {
        accountShiftTypeId: 3,
        name: '나이트',
        startTime: new Date(),
        endTime: new Date(),
        color: '#3580ff',
        classification: 'NIGHT',
      },
    ],
    accountShiftTypeList: [
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1,
      2, 3, 1, 2, 3, 1, 2, 3,
    ],
  },
  {
    accountId: 1,
    name: '조성연',
    profileImgBase64: '',
    accountShiftTypes: [
      {
        accountShiftTypeId: 1,
        name: '데이',
        startTime: new Date(),
        endTime: new Date(),
        color: '#4dc2ad',
        classification: 'DAY',
      },
      {
        accountShiftTypeId: 2,
        name: '이브닝',
        startTime: new Date(),
        endTime: new Date(),
        color: '#ff8ba5',
        classification: 'EVENING',
      },
      {
        accountShiftTypeId: 3,
        name: '나이트',
        startTime: new Date(),
        endTime: new Date(),
        color: '#3580ff',
        classification: 'NIGHT',
      },
    ],
    accountShiftTypeList: [
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1,
      2, 3, 1, 2, 3, 1, 2, 3,
    ],
  },
];
