import PageViewContainer from '@components/PageView';
import { Text, Image, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { images } from '@assets/images/onboarding';
import { useState } from 'react';
import { COLOR, screenWidth } from 'index.style';
import { useLinkProps } from '@react-navigation/native';

const guideText = [
  {
    text1: '근무 관리부터',
    text2: '개인 일정까지 한번에',
    text3: '듀팅 하나로 모든 일정을 관리해보세요.',
  },
  {
    text1: '친구 · 동료의 근무도',
    text2: '한눈에',
    text3: '겹치는 근무부터 월별가지 모아보고 요약보고!',
  },
];

const OnboardingPage = () => {
  const [page, setPage] = useState(0);
  const { onPress } = useLinkProps({ to: { screen: 'Home' } });

  const pageScrollHandler = (e: PagerViewOnPageSelectedEvent) => {
    const { position } = e.nativeEvent;
    setPage(position);
  };

  return (
    <PageViewContainer withoutLogin>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.guidTextWrapper}>
          <Text style={styles.guideText}>{guideText[page].text1}</Text>
          <Text style={styles.guideText}>{guideText[page].text2}</Text>
          <Text style={styles.guideSubText}>{guideText[page].text3}</Text>
        </View>
        <PagerView style={styles.pagerView} initialPage={0} onPageSelected={pageScrollHandler}>
          <View style={styles.pageView} key="1">
            <Image source={images[0]} resizeMode="contain" style={styles.image} />
          </View>
          <View style={styles.pageView} key="2">
            <Image source={images[1]} resizeMode="contain" style={styles.image} />
          </View>
        </PagerView>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {images.map((item, i) => (
            <View
              key={item}
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
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
          <Pressable onPress={onPress} style={{ marginRight: 32, marginBottom: 52 }}>
            <Text style={styles.passText}>건너뛰기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  guidTextWrapper: {
    justifyContent: 'center',
    marginTop: 73,
    marginLeft: 32,
  },
  guideText: {
    fontFamily: 'Line',
    fontSize: 20,
    color: '#150b3c',
  },
  guideSubText: {
    fontSize: 14,
    fontFamily: 'Apple',
    marginTop: 12,
    color: '#ababb4',
  },
  pagerView: {
    flex: 5,
  },
  pageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
  },
  passText: {
    fontFamily: 'Apple500',
    fontSize: 16,
    color: COLOR.sub3,
    textDecorationLine: 'underline',
    textDecorationColor: COLOR.sub3,
  },
});

export default OnboardingPage;
