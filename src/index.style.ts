import { hexToRgba } from '@libs/utils/color';
import { Dimensions } from 'react-native';

export const COLOR = {
  main1: '#844AFF',
  main2: '#b08bff',
  main3: '#ceb6ff',
  main4: '#EDE4FF',
  sub1: '#242428',
  sub2: '#595961',
  sub25: '#93939D',
  sub3: '#ABABB4',
  sub4: '#d6d6de',
  sub45: '#E7E7EF',
  sub5: '#f2f2f7',
  bg: '#FDFCFE',
  invalidBorder: hexToRgba('#ff4a80', 0.7),
  invalidText: '#ff4a80',
};

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;
