import { COLOR } from 'index.style';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { hexToRgba } from '@libs/utils/color';
import Modal from 'react-native-modal';
import NextButton from '@components/NextButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NextArrowIcon from '@assets/svgs/next-arrow.svg';
import PasteIcon from '@assets/svgs/paste.svg';
import useCodeInput from './useCodeInput';
import useEnterWard from './useEnterWard';
import { useEffect } from 'react';

const Code = () => {
  const {
    states: { code, mainCodeInputRef },
    actions: { handleMainInputChange, handlePasteCode },
  } = useCodeInput();

  const {
    states: { error, openModal, ward },
    actions: { setError, enterWard, handleGetWard, navigateToWard },
  } = useEnterWard();

  useEffect(() => {
    if (code.length === 6) {
      handleGetWard(code);
    } else {
      setError(false);
    }
  }, [code]);

  return (
    <View>
      <View style={styles.guidTextWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.guideTextHighlight}>병동 코드</Text>
            <View style={styles.guideTextUnderline} />
          </View>
          <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
            를
          </Text>
        </View>
        <Text style={[styles.guideText, { marginTop: 10 }]}>입력해주세요</Text>
        <Text style={styles.guideSubText}>전달 받은 ‘병동 입장 코드’ 6자리를 입력해주세요.</Text>
      </View>
      <View
        style={{
          marginTop: 52,
          marginBottom: error || ward ? 12 : 42,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <TextInput
            ref={mainCodeInputRef}
            style={styles.mainCodeInput}
            value={code}
            onChangeText={handleMainInputChange}
          />
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <TextInput
              key={i}
              value={code[i]}
              maxLength={1}
              onFocus={() => mainCodeInputRef.current?.focus()}
              style={{
                ...styles.codeInput,
                borderColor: !error
                  ? code.length === i || (code.length === 6 && i === 5)
                    ? COLOR.sub3
                    : COLOR.main4
                  : hexToRgba('#ff4a80', 0.7),
              }}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handlePasteCode} style={styles.pasteButton}>
          <PasteIcon />
          <Text style={styles.pasteText}>붙여넣기</Text>
        </TouchableOpacity>
        {error && (
          <View style={styles.feedBack}>
            <Text style={styles.feedBackText}>올바른 코드가 아닙니다. 다시 한번 확인해주세요.</Text>
          </View>
        )}
        {ward && (
          <View style={styles.feedBack}>
            <Text style={{ ...styles.feedBackText, color: COLOR.main2 }}>
              {ward.hospitalName} - {ward.name}에 입장하시겠습니까?
            </Text>
          </View>
        )}
      </View>
      <NextButton
        disabled={!ward || !!error || code.length < 6}
        text="입장"
        Icon={NextArrowIcon}
        onPress={() => enterWard(ward!.wardId)}
      />
      <Modal isVisible={openModal} onBackdropPress={() => navigateToWard()}>
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
    marginTop: 70,
    marginBottom: 8,
  },
  mainCodeInput: {
    position: 'absolute',
    opacity: 0,
    zIndex: 20,
    width: '100%',
    height: '100%',
    fontSize: 1,
    textAlign: 'center',
  },
  codeInput: {
    width: 35,
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontFamily: 'Apple',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    backgroundColor: COLOR.bg,
  },
  pasteButton: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  pasteText: {
    fontSize: 14,
    color: COLOR.sub3,
    fontFamily: 'Apple',
  },
  feedBack: {
    height: 22,
    alignItems: 'center',
    marginTop: 8,
  },
  feedBackText: {
    fontSize: 14,
    fontFamily: 'Apple',
    color: '#ff4a80',
  },
});

export default Code;
