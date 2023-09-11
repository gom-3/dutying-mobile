import { View, Text, StyleSheet, Platform, TextInput, Pressable } from 'react-native';
import NextArrowIcon from '@assets/svgs/next-arrow.svg';
import NextButton from '@components/NextButton';
import ExitIcon from '@assets/svgs/exit-white.svg';
import { COLOR } from 'index.style';
import useName from './index.hook';

const Name = () => {
  const {
    states: { name, isValid, feedback },
    actions: { onChangeTextInput, clearTextInput, toNextStep },
  } = useName();
  return (
    <View>
      <View style={styles.guidTextWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.guideTextHighlight}>이름</Text>
            <View style={styles.guideTextUnderline} />
          </View>
          <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
            을
          </Text>
        </View>
        <Text style={[styles.guideText, { marginTop: 10 }]}>입력해주세요</Text>
        <Text style={styles.guideSubText}>입력해주신 이름으로 프로필이 생성됩니다.</Text>
      </View>
      <View style={styles.textInputView}>
        <TextInput
          value={name}
          maxLength={10}
          placeholder="김듀팅"
          style={styles.textInput}
          onChangeText={onChangeTextInput}
        />
        <Pressable onPress={clearTextInput} style={styles.clearPosition}>
          <View style={styles.clear}>
            <ExitIcon />
          </View>
        </Pressable>
      </View>
      <Text style={styles.feedback}>{feedback}</Text>
      <NextButton disabled={!isValid} text="다음" Icon={NextArrowIcon} onPress={toNextStep} />
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

export default Name;
