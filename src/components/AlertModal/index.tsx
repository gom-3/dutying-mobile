import { COLOR, screenWidth } from 'index.style';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal, ModalContent } from 'react-native-modals';

interface Props {
  text: string;
  highlight: string;
  subText: string;
  cancelText: string;
  close: () => void;
  acceptText: string;
  accept: () => void;
  isOpen: boolean;
}

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
