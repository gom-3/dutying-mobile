import { View, Text, StyleSheet, Platform, TextInput, Pressable } from 'react-native';
import NextArrowIcon from '@assets/svgs/next-arrow.svg';
import PasteIcon from '@assets/svgs/paste.svg';
import NextButton from '@components/NextButton';
import { COLOR } from 'index.style';
import useCode from './index.hook';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

const Code = () => {
  const {
    states: { focusedIndex, codeList, codeRefList, error, open, ward },
    actions: { setFocusedIndex, enterWard, navigateToWard, handleKeyDown, handlePasteCode },
  } = useCode();

  return (
    <View>
      <View style={styles.guidTextWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.guideTextHighlight}>병동코드</Text>
            <View style={styles.guideTextUnderline} />
          </View>
          <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
            를
          </Text>
        </View>
        <Text style={[styles.guideText, { marginTop: 10 }]}>입력해주세요</Text>
        <Text style={styles.guideSubText}>전달 받은 ‘병동 입장 코드’ 6자리를 입력해주세요.</Text>
      </View>
      <View style={{ marginBottom: 42, marginTop: 52 }}>
        <View style={styles.textInputView}>
          {codeList.map((code, index) => (
            <TextInput
              key={index}
              ref={codeRefList.current[index]}
              style={{
                ...styles.codeInput,
                borderColor: focusedIndex === index ? COLOR.main1 : COLOR.main4,
              }}
              value={code === null ? undefined : code}
              placeholder="0"
              onPressIn={() => setFocusedIndex(index)}
              onKeyPress={(e) => handleKeyDown(e.nativeEvent.key)}
            />
          ))}
          <TouchableOpacity onPress={handlePasteCode}>
            <PasteIcon />
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.feedback}>{error}</Text>}
        {ward && (
          <Text style={styles.feedback}>
            {ward.hospitalName}병원 {ward.name}병동
          </Text>
        )}
      </View>
      <NextButton
        disabled={!ward || !!error || codeList.some((x) => x === null)}
        text="입장"
        Icon={NextArrowIcon}
        onPress={() => enterWard(ward!.wardId)}
      />
      <Modal isVisible={open} onBackdropPress={() => navigateToWard()}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <View
            style={{
              paddingHorizontal: 38,
              paddingVertical: 42,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Apple500',
                color: COLOR.main1,
              }}
            >
              {ward?.name}병동 입장
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Apple500',
                color: COLOR.sub1,
              }}
            >
              승인 대기 중입니다.
            </Text>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 16,
                color: COLOR.sub2,
                fontFamily: 'Apple',
                fontSize: 14,
              }}
            >
              관리자의 승인이 되면 알림으로 알려드릴게요!
            </Text>
          </View>
          <Pressable
            style={{
              width: '100%',
              backgroundColor: COLOR.main1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
            onPress={() => navigateToWard()}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Apple500' }}>확인</Text>
          </Pressable>
        </View>
      </Modal>
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
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    gap: 10,
    marginLeft: 33,
    marginRight: 33,
  },
  codeInput: {
    width: 35,
    height: 50,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLOR.main4,
    fontFamily: 'Poppins',
    fontSize: 24,
    color: COLOR.sub1,
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
  ward: {
    textAlign: 'center',
    marginBottom: 18,
    color: COLOR.sub1,
    fontSize: 14,
    fontFamily: 'Apple',
  },
  feedback: {
    textAlign: 'center',
    marginBottom: 18,
    color: COLOR.main1,
    fontSize: 14,
    fontFamily: 'Apple',
  },
});

export default Code;
