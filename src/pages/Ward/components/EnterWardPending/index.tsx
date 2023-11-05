import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoIcon from '@assets/svgs/logo-selected.svg';
import DoubleArrowIcon from '@assets/svgs/double-right-arrow.svg';
import NextButton from '@components/NextButton';
import { COLOR } from 'index.style';
import useEnterWardPending from './index.hook';
import { useState } from 'react';
import Modal from 'react-native-modal';

function EnterWardPendingPage() {
  const {
    states: { account, accountWaitingWard },
    actions: { cancelWaiting, navigateToEnterWard },
  } = useEnterWardPending();
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView
      style={{
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        height: '70%',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 30 }}>
        <Text style={{ color: COLOR.main1, fontSize: 32, fontFamily: 'Poppins600' }}>
          Coming soon
        </Text>
        <LogoIcon />
      </View>
      <View style={{ alignItems: 'center', margin: 30 }}>
        <Text>듀팅 웹사이트에서 근무표를 작성하면</Text>
        <Text>더 간편한 듀팅이 될 수 있어요!</Text>
      </View>
      <View style={{ width: '100%', margin: 30 }}>
        {account.status === 'WARD_ENTRY_PENDING' ? (
          <>
            <NextButton disabled text="병동 입장 승인 대기 중입니다." onPress={() => {}} />
            <Text
              style={{
                textAlign: 'center',
                marginTop: 16,
                fontFamily: 'Apple500',
                fontSize: 12,
                color: COLOR.main2,
                textDecorationLine: 'underline',
              }}
              onPress={() => setOpen(true)}
            >
              입장 취소하기
            </Text>
          </>
        ) : (
          <NextButton
            text="우리 병동에 도입하기"
            onPress={navigateToEnterWard}
            Icon={DoubleArrowIcon}
          />
        )}
      </View>
      <Modal isVisible={open} onBackdropPress={() => setOpen(false)}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            // width: screenWidth * 0.84,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              paddingHorizontal: 70,
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
                color: 'black',
              }}
            >
              {accountWaitingWard?.name}병동 입장을
            </Text>
            <Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontFamily: 'Apple500',
                  color: COLOR.main1,
                }}
              >
                취소
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontFamily: 'Apple500',
                  color: 'black',
                }}
              >
                하시겠어요?
              </Text>
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
              입력하신 관련 정보는 즉시 삭제됩니다.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOR.sub4,
                flex: 1,
                paddingVertical: 15,
                borderBottomLeftRadius: 10,
              }}
              onPress={() => setOpen(false)}
            >
              <Text style={{ color: COLOR.sub1, fontFamily: 'Apple500', fontSize: 16 }}>
                아니요
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                accountWaitingWard && cancelWaiting(accountWaitingWard.wardId, account.nurseId);
                setOpen(false);
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOR.main1,
                paddingVertical: 15,
                borderBottomRightRadius: 10,
              }}
            >
              <Text style={{ color: 'white', fontFamily: 'Apple500', fontSize: 16 }}>
                네, 취소할게요
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default EnterWardPendingPage;
