import { Pressable, Text, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoubleArrowIcon from '@assets/svgs/double-right-arrow.svg';
import NextButton from '@components/NextButton';
import { COLOR, screenWidth } from 'index.style';
import useEnterWardPending from './index.hook';
import { useMemo, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import FullLogo from '@assets/svgs/logo-full.svg';
import Carousel from 'react-native-reanimated-carousel';
import { images } from '@assets/images/ward';
import * as Linking from 'expo-linking';

interface CarouselDataType {
  image: any;
  text1: JSX.Element;
  text2: JSX.Element;
}

function EnterWardPendingPage() {
  const {
    states: { account, accountWaitingWard },
    actions: { cancelWaiting, navigateToEnterWard },
  } = useEnterWardPending();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const changePage = (index: number) => {
    setPage(index);
  };

  const datas: CarouselDataType[] = useMemo(
    () => [
      {
        image: images[0],
        text1: (
          <Text style={styles.imageText}>
            <Text
              style={styles.imageTextHighlight}
              onPress={() => Linking.openURL('https://www.dutying.net')}
            >
              듀팅 웹사이트
            </Text>
            에서 더 간편하게
          </Text>
        ),
        text2: <Text style={styles.imageText}>근무표를 작성해보세요!</Text>,
      },
      {
        image: images[1],
        text1: <Text style={styles.imageText}>웹과 듀팅 앱을 연동하면,</Text>,
        text2: <Text style={styles.imageText}>근무표와 신청 근무를 확인할 수 있어요</Text>,
      },
      {
        image: images[2],
        text1: (
          <Text
            style={styles.imageTextHighlightThin}
            onPress={() => Linking.openURL('https://www.dutying.net')}
          >
            더 자세한 듀팅
          </Text>
        ),
        text2: (
          <Text
            style={styles.imageTextHighlightThin}
            onPress={() => Linking.openURL('https://www.dutying.net')}
          >
            보러가기
          </Text>
        ),
      },
    ],
    [],
  );

  // const carouselRef = useRef<any>(null);

  const renderItem = ({ item }: { item: CarouselDataType }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: screenWidth,
            height: screenWidth,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLOR.sub5,
            borderRadius: 10,
            backgroundColor: 'white',
            shadowColor: '#ede9f5',
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 34,
            elevation: 10,
          }}
        >
          <Image
            style={{ width: screenWidth, height: screenWidth }}
            // width={screenWidth}
            // height={screenWidth}
            source={item.image}
            resizeMode="contain"
          />
        </View>
        <View style={{ marginTop: 12 }} />
        {item.text1}
        {item.text2}
      </View>
    );
  };
  return (
    <SafeAreaView>
      <View style={{ width: '100%', marginLeft: 34, marginTop: 20 }}>
        <FullLogo height={32} width={87} />
      </View>
      <View>
        <Carousel
          loop={false}
          // ref={carouselRef}
          data={datas}
          renderItem={renderItem}
          width={screenWidth}
          height={screenWidth + 50}
          onScrollEnd={changePage}
          mode="parallax"
          modeConfig={{ parallaxScrollingScale: 0.85 }}
        />
      </View>
      <View
        style={{
          marginTop: 30,
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: page === i ? 18 : 6,
              height: 6,
              backgroundColor: page === i ? COLOR.sub1 : COLOR.sub3,
              borderRadius: 6,
              marginLeft: i !== 0 ? 5 : 0,
            }}
          />
        ))}
      </View>
      <View style={{ width: '100%', padding: 30 }}>
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
          <View>
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ color: COLOR.sub3, fontFamily: 'Apple500', fontSize: 14 }}>
                이미 만들어진 병동이 있다면?
              </Text>
            </View>
            <NextButton text="병동 입장" onPress={navigateToEnterWard} Icon={DoubleArrowIcon} />
          </View>
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

const styles = StyleSheet.create({
  imageText: {
    marginTop: 4,
    color: COLOR.sub2,
    fontFamily: 'Apple500',
    fontSize: 18,
  },
  imageTextHighlight: {
    marginTop: 4,
    color: COLOR.main1,
    fontFamily: 'Apple600',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  imageTextHighlightThin: {
    marginTop: 4,
    color: COLOR.main1,
    fontFamily: 'Apple500',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});

export default EnterWardPendingPage;
