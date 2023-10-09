import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { COLOR } from 'index.style';
import { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RightArrowIcon from '@assets/svgs/right-arrow-white.svg';
import { useMutation } from '@tanstack/react-query';
import { SearchMoimFromCodeResponseDTO, searchMoimCode } from '@libs/api/moim';
import { AlertModalEnter } from '@components/AlertModal';
import { hexToRgba } from '@libs/utils/color';
import { useAccountStore } from 'store/account';

const MoimEnterPage = () => {
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account] = useAccountStore((state) => [state.account]);
  const [moim, setMoim] = useState<SearchMoimFromCodeResponseDTO>();
  const [isValid, setIsValid] = useState(true);
  const refs = Array.from({ length: 6 }).map(() => useRef<TextInput>(null));

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (text: string, index: number) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = text;
      return newValues;
    });
    setMoim(undefined);
    setIsValid(true);
    if (text) {
      if (index < 5 && refs[index + 1].current) refs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (index > 0 && refs[index - 1].current) refs[index - 1].current?.focus();
    }
  };

  useEffect(() => {
    if (refs[0].current) refs[0].current.focus();
  }, []);

  const { mutate: searchMoimMutate } = useMutation(() => searchMoimCode(values.join('')), {
    onSuccess: (data) => {
      setMoim(data);
      setIsModalOpen(true);
      refs.forEach((ref) => ref.current?.blur());
    },
    onError: () => {
      setIsValid(false);
    },
  });

  const pressEnterButton = () => {
    if (values.join('').length !== 6) {
      setIsValid(false);
    } else {
      searchMoimMutate();
    }
  };

  return (
    <PageViewContainer>
      <SafeAreaView>
        {moim && (
          <AlertModalEnter
            isOpen={isModalOpen}
            moim={moim}
            accountId={account.accountId}
            close={closeModal}
          />
        )}
        <PageHeader title="모임 입장" />
        <View style={{ marginTop: 32, marginBottom: 70, marginHorizontal: 32 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Line', color: '#150b3c' }}>
            <Text style={{ textDecorationLine: 'underline' }}>모임 초대 코드</Text>를
          </Text>
          <Text style={{ fontSize: 24, fontFamily: 'Line', color: '#150b3c' }}>입력해주세요</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {values.map((value, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              value={value}
              maxLength={1}
              keyboardType="numbers-and-punctuation"
              onChangeText={(text) => handleChange(text, i)}
              style={{
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
                borderColor: isValid ? COLOR.main4 : hexToRgba('#ff4a80', 0.7),
                backgroundColor: COLOR.bg,
              }}
              onKeyPress={(e) => handleKeyPress(i, e)}
            />
          ))}
        </View>
        {!isValid && (
          <View style={{ height: 22, alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Apple', color: '#ff4a80' }}>
              올바른 코드가 아닙니다. 다시 한번 확인해주세요.
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={pressEnterButton}
          style={{
            flexDirection: 'row',
            backgroundColor: COLOR.main1,
            marginHorizontal: 32,
            marginVertical: isValid ? 85 : 55,
            padding: 13,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'Apple500',
              marginLeft: 10,
              marginRight: 5,
            }}
          >
            입장
          </Text>
          <RightArrowIcon />
        </TouchableOpacity>
      </SafeAreaView>
    </PageViewContainer>
  );
};

export default MoimEnterPage;
