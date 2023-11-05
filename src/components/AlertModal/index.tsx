import { COLOR } from 'index.style';
import { View, Text, TouchableOpacity, Pressable, Share, Alert, Image } from 'react-native';

import CopyIcon from '@assets/svgs/copy.svg';
import * as Clipboard from 'expo-clipboard';
import { SearchMoimFromCodeResponseDTO, joinMoim } from '@libs/api/moim';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { sendRequestFriend } from '@libs/api/friend';

type ModalProps = {
  text: string;
  highlight: string;
  subText?: string;
  cancelText: string;
  close: () => void;
  acceptText: string;
  accept: () => void;
  isOpen: boolean;
};

type InviteProps = Pick<ModalProps, 'isOpen' | 'close' | 'text' | 'subText'> & { code: string };

export const AlertModalInvite = ({ code, isOpen, text, subText, close }: InviteProps) => {
  const copyMoimCode = async () => {
    await Clipboard.setStringAsync(code);
  };

  return (
    <Modal isVisible={isOpen} onBackdropPress={close}>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontFamily: 'Apple500', marginTop: 42 }}>{text}</Text>
        {subText && (
          <Text
            style={{
              textAlign: 'center',
              color: COLOR.sub2,
              fontFamily: 'Apple',
              fontSize: 14,
              marginTop: 16,
              marginBottom: 42,
            }}
          >
            {subText}
          </Text>
        )}
        <View style={{ flexDirection: 'row' }}>
          {code.split('').map((char, i) => (
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
              <Text style={{ fontSize: 24, fontFamily: 'Apple' }}>{char}</Text>
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
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => Share.share({ message: code, title: '초대 코드' })}
        >
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Apple500' }}>공유하기</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

type RequestFriendProps = Pick<ModalProps, 'isOpen' | 'close'> &
  Pick<Account, 'accountId' | 'profileImgBase64' | 'name'>;

export const AlertModalRequestFriend = ({
  isOpen,
  close,
  accountId,
  profileImgBase64,
  name,
}: RequestFriendProps) => {
  const navigate = useNavigation();
  const { mutate: sendRequestFriendMutate } = useMutation(() => sendRequestFriend(accountId), {
    onSuccess: () => {
      navigate.goBack();
    },
  });

  const pressEnterButton = () => {
    close();
    sendRequestFriendMutate();
  };

  return (
    <Modal isVisible={isOpen} onBackdropPress={close}>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}
      >
        <View style={{ alignItems: 'center', marginTop: 42 }}>
          <Text style={{ fontSize: 20, fontFamily: 'Apple500' }}>
            <Text style={{ color: COLOR.main1, fontFamily: 'Apple600' }}>친구 신청</Text>을
            보내시겠어요?
          </Text>
        </View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 16,
            color: COLOR.sub2,
            fontFamily: 'Apple',
            fontSize: 14,
          }}
        >
          상대방이 수락하면 친구 추가가 완료됩니다.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLOR.sub5,
            borderColor: COLOR.sub4,
            borderWidth: 0.5,
            borderRadius: 5,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginTop: 32,
          }}
        >
          <Image
            source={{ uri: `data:image/png;base64,${profileImgBase64}` }}
            style={{ width: 24, height: 24, marginRight: 8, borderRadius: 50 }}
          />
          <Text>{name}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLOR.sub4,
              flex: 1.1,
              marginTop: 49,
              paddingVertical: 15,
              borderBottomLeftRadius: 10,
            }}
            onPress={close}
          >
            <Text style={{ color: COLOR.sub1, fontFamily: 'Apple500', fontSize: 16 }}>아니요</Text>
          </Pressable>
          <Pressable
            style={{
              marginTop: 49,
              flex: 1,
              backgroundColor: COLOR.main1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
              borderBottomRightRadius: 10,
            }}
            onPress={pressEnterButton}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Apple500' }}>
              네, 보낼게요
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

type EnterProps = Pick<ModalProps, 'isOpen' | 'close'> & {
  moim: SearchMoimFromCodeResponseDTO;
  accountId: number;
};

export const AlertModalEnter = ({ isOpen, close, moim, accountId }: EnterProps) => {
  const navigate = useNavigation();
  const queryClient = useQueryClient();
  const { mutate: enterMoimMutate } = useMutation(() => joinMoim(moim?.moimId, accountId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['getMoimList', accountId]);
      queryClient.refetchQueries(['getMoimList', accountId]);
      navigate.goBack();
    },
  });

  const pressEnterButton = () => {
    close();
    enterMoimMutate();
  };

  return (
    <Modal isVisible={isOpen} onBackdropPress={close}>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          // width: screenWidth * 0.84,
        }}
      >
        <View style={{ alignItems: 'center', marginTop: 42 }}>
          <Text style={{ fontSize: 20, fontFamily: 'Apple500' }}>
            <Text style={{ color: COLOR.main1, fontFamily: 'Apple600' }}>{moim.moimName}</Text>에
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'Apple500' }}>입장하시겠어요?</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLOR.sub4,
              flex: 1.1,
              marginTop: 49,
              paddingVertical: 15,
              borderBottomLeftRadius: 10,
            }}
            onPress={close}
          >
            <Text style={{ color: COLOR.sub1, fontFamily: 'Apple500', fontSize: 16 }}>아니요</Text>
          </Pressable>
          <Pressable
            style={{
              marginTop: 49,
              flex: 1,
              backgroundColor: COLOR.main1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
              borderBottomRightRadius: 10,
            }}
            onPress={pressEnterButton}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Apple500' }}>입장 하기</Text>
          </Pressable>
        </View>
      </View>
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
}: ModalProps) => {
  const textArray = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <Modal isVisible={isOpen} onBackdropPress={close}>
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
              borderBottomLeftRadius: 10,
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
              borderBottomRightRadius: 10,
            }}
          >
            <Text style={{ color: 'white', fontFamily: 'Apple500', fontSize: 16 }}>
              {acceptText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
