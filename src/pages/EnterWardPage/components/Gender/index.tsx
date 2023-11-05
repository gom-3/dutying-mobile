import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import NextArrowIcon from '@assets/svgs/next-arrow.svg';
import NextButton from '@components/NextButton';
import { COLOR } from 'index.style';
import useGender from './index.hook';

const Gender = () => {
  const {
    states: { gender },
    actions: { onChangeTextInput, toNextStep },
  } = useGender();
  return (
    <View>
      <View style={styles.guidTextWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.guideTextHighlight}>성별</Text>
            <View style={styles.guideTextUnderline} />
          </View>
          <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
            을
          </Text>
        </View>
        <Text style={[styles.guideText, { marginTop: 10 }]}>선택해주세요</Text>
        <Text style={styles.guideSubText}>선택해주신 성별로 병동에 입장합니다.</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 62, height: 50, marginBottom: 42 }}>
        <Pressable
          onPress={() => onChangeTextInput('남')}
          style={{
            padding: 6,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderWidth: 1,
            backgroundColor: gender === '남' ? COLOR.main1 : COLOR.bg,
            borderColor: gender === '남' ? COLOR.main1 : COLOR.main4,
          }}
        >
          <Text
            style={{
              color: gender === '남' ? 'white' : COLOR.sub2,
              fontFamily: 'Apple500',
              fontSize: 20,
            }}
          >
            남성
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeTextInput('여')}
          style={{
            padding: 6,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            borderWidth: 1,
            backgroundColor: gender === '여' ? COLOR.main1 : COLOR.bg,
            borderColor: gender === '여' ? COLOR.main1 : COLOR.main4,
          }}
        >
          <Text
            style={{
              color: gender === '여' ? 'white' : COLOR.sub2,
              fontFamily: 'Apple500',
              fontSize: 20,
            }}
          >
            여성
          </Text>
        </Pressable>
      </View>
      <NextButton disabled={!gender} text="다음" Icon={NextArrowIcon} onPress={toNextStep} />
    </View>
  );
};

const styles = StyleSheet.create({
  guidTextWrapper: {
    justifyContent: 'center',
    marginTop: 42,
  },
  guideText: {
    fontFamily: 'Line',
    fontSize: 20,
    color: '#150b3c',
  },
  guideTextHighlight: {
    fontSize: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  guideTextUnderline: {
    height: 1,
    backgroundColor: '#150b3c',
  },
  guideSubText: {
    fontSize: 14,
    fontFamily: 'Apple',
    marginTop: 12,
    color: '#ababb4',
  },
  textInputView: {
    marginTop: 70,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 24,
    padding: 2,
    borderBottomColor: COLOR.main3,
    borderBottomWidth: 1,
  },
  clearPosition: {
    position: 'absolute',
    right: 3,
    top: 3,
  },
  clear: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: COLOR.main3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedback: {
    marginBottom: 18,
    color: COLOR.main1,
    fontSize: 14,
    fontFamily: 'Apple',
  },
});

export default Gender;
