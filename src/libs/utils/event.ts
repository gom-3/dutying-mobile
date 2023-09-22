import { Frequency } from 'expo-calendar';
import { days } from './date';
import analytics from '@react-native-firebase/analytics';
import Constants from 'expo-constants';

export const alarmList = [
  { text: '정각', time: 0 },
  { text: '10분 전', time: -10 },
  { text: '30분 전', time: -30 },
  { text: '1시간 전', time: -60 },
  { text: '1일 전', time: 0 },
];

export const getRecurrenceRuleList = (startDate: Date) => [
  { text: '매일', frequency: Frequency.DAILY },
  { text: `매주 ${days[startDate.getDay()]}요일`, frequency: Frequency.WEEKLY },
  { text: `매월 ${startDate.getDate()}일`, frequency: Frequency.MONTHLY },
  {
    text: `매년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일`,
    frequency: Frequency.YEARLY,
  },
];

export const firebaseLogEvent = (name:string) => {
  if(Constants.appOwnership !== 'expo'){
    analytics().logEvent(name);
  }
}