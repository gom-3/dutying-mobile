import { COLOR, screenWidth } from 'index.style';
import { View, Text, TouchableOpacity, Pressable, Share } from 'react-native';
import { Modal, ModalContent } from 'react-native-modals';
import CopyIcon from '@assets/svgs/copy.svg';
import * as Clipboard from 'expo-clipboard';

interface Props {
  text: string;
  highlight: string;
  subText?: string;
  cancelText: string;
  close: () => void;
  acceptText: string;
  accept: () => void;
  isOpen: boolean;
}

interface InviteProps {
  moimCode: string;
  isOpen: boolean;
  close: () => void;
}

export const AlertModalInvite = ({ moimCode, isOpen, close }: InviteProps) => {
  const copyMoimCode = async () => {
    await Clipboard.setStringAsync(moimCode);
  };

  return (
    <Modal visible={isOpen} onTouchOutside={close}>
      <ModalContent
        style={{
          marginHorizontal: -20,
          marginVertical: -25,
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', width: screenWidth * 0.84 }}>
          <Text style={{ fontSize: 20, fontFamily: 'Apple500', margin: 42 }}>모임 초대 코드</Text>
          <View style={{ flexDirection: 'row' }}>
            {moimCode.split('').map((code, i) => (
              <View
                key={i}
                style={{
                  padding: 10,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: COLOR.main4,
                  backgroundColor: COLOR.bg,
                  margin: 3,
                }}
              >
                <Text style={{ fontSize: 24, fontFamily: 'Apple' }}>{code}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={copyMoimCode}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 19 }}
          >
            <CopyIcon />
            <Text style={{ marginLeft: 5, fontSize: 14, fontFamily: 'Apple', color: COLOR.sub3 }}>
              복사하기
            </Text>
          </TouchableOpacity>
          <Pressable
            style={{
              marginTop: 49,
              width: '100%',
              backgroundColor: COLOR.main1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
            onPress={() => Share.share({ message: moimCode })}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Apple500' }}>공유하기</Text>
          </Pressable>
        </View>
      </ModalContent>
    </Modal>
  );
};

const AlertModal = ({
  text,
  highlight,
  subText,
  isOpen,
  close,
  accept,
  cancelText,
  acceptText,
}: Props) => {
  const textArray = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <Modal visible={isOpen} onTouchOutside={close}>
      <ModalContent
        style={{
          marginHorizontal: -20,
          marginVertical: -25,
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', width: screenWidth * 0.84 }}>
          <View
            style={{
              paddingHorizontal: 70,
              paddingVertical: 42,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>
              {textArray.map((string, index) => (
                <Text
                  key={index}
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Apple500',
                    color: string === highlight ? COLOR.main1 : 'black',
                  }}
                >
                  {string}
                </Text>
              ))}
            </Text>
            {subText && (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 16,
                  color: COLOR.sub2,
                  fontFamily: 'Apple',
                  fontSize: 14,
                }}
              >
                {subText}
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOR.sub4,
                flex: 1,
                paddingVertical: 15,
              }}
              onPress={close}
            >
              <Text style={{ color: COLOR.sub1, fontFamily: 'Apple500', fontSize: 16 }}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={accept}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLOR.main1,
                paddingVertical: 15,
              }}
            >
              <Text style={{ color: 'white', fontFamily: 'Apple500', fontSize: 16 }}>
                {acceptText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
