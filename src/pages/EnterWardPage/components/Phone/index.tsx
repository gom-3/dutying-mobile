import { View, Text, StyleSheet, Platform, TextInput, Pressable } from 'react-native';
import NextArrowIcon from '@assets/svgs/next-arrow.svg';
import NextButton from '@components/NextButton';
import ExitIcon from '@assets/svgs/exit-white.svg';
import { COLOR } from 'index.style';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import usePhone from './index.hook';

const Phone = () => {
  const {
    states: { phoneNum, isValid, feedback },
    actions: { onChangeTextInput, clearTextInput, toNextStep },
  } = usePhone();
  return (
    <View>
      <View style={styles.guidTextWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.guideTextHighlight}>전화번호</Text>
            <View style={styles.guideTextUnderline} />
          </View>
          <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
            를
          </Text>
        </View>
        <Text style={[styles.guideText, { marginTop: 10 }]}>입력해주세요</Text>
        <Text style={styles.guideSubText}>병동내 본인 확인을 위해 전화번호가 사용됩니다.</Text>
      </View>
      <View style={styles.textInputView}>
        <TextInput
          autoFocus
          value={phoneNum}
          maxLength={11}
          placeholder="-제외 휴대폰 번호 입력"
          style={styles.textInput}
          onChangeText={onChangeTextInput}
        />
        {phoneNum.length > 0 && (
          <Animated.View
            style={styles.clearPosition}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Pressable onPress={clearTextInput}>
              <View style={styles.clear}>
                <ExitIcon />
              </View>
            </Pressable>
          </Animated.View>
        )}
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

export default Phone;