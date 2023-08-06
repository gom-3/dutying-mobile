import { styled } from 'styled-components/native';
import { Dimensions } from 'react-native';

export const COLOR = {
  main1: '#844AFF',
  main2: '#b08bff',
  main4: '#EDE4FF',
  sub1: '#242428',
  sub2: '#595961',
  sub25: '#93939D',
  sub3: '#ABABB4',
  sub45: '#E7E7EF',
  sub5: '#f2f2f7',
  bg: '#FDFCFE',
};

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

export const PageViewContainer = styled.View`
  width: ${screenWidth}px;
  height: ${screenHeight}px;
  position: relative;
  background-color: white;
  z-index: 5;
`;
