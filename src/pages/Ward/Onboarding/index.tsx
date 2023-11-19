import PageViewContainer from '@components/PageView';
import { Text, Image, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { images } from '@assets/images/ward/onboarding/index';
import { useState } from 'react';
import { COLOR, screenWidth } from 'index.style';
import { useLinkProps } from '@react-navigation/native';
import WardIcon from '@assets/svgs/ward-selected.svg';
import { useOnboardingStore } from 'store/onboarding';

const guideText = [
  {
    text1: '이제 근무표 등록은',
    text2: '자동으로 해드릴게요!',
    text3: '웹에서 근무표 등록 시, 자동으로 반영됩니다.',
  },
  {
    text1: '근무 유형은',
    text2: '병동에서 쓰는 유형 그대로!',
    text3: '기존에 없던 근무 유형은 새로 추가됩니다.',
  },
  {
    text1: '신청 근무도',
    text2: '모바일로 신청할 수 있어요',
    text3: '근무표 작성자의 검토 후 근무표에 반영됩니다. ',
  },
];

const WardOnboardingPage = () => {
  const [page, setPage] = useState(0);
  const [setState] = useOnboardingStore((state) => [state.setState]);
  const { onPress } = useLinkProps({ to: { screen: 'Ward' } });

  const endOnboarding = () => {
    setState('ward', true);
    onPress();
  };

  const pageScrollHandler = (e: PagerViewOnPageSelectedEvent) => {
    const { position } = e.nativeEvent;
    setPage(position);
  };

  return (
    <PageViewContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 8,
            paddingVertical: 5,
            backgroundColor: COLOR.main4,
            borderRadius: 5,
            alignItems: 'center',
            width: 64,
            marginLeft: 28,
            marginTop: 35,
          }}
        >
          <WardIcon width={20} height={20} />
          <Text style={{ fontSize: 14, fontFamily: 'Apple', color: COLOR.main1 }}>병동</Text>
        </View>
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
          <View style={styles.pageView} key="3">
            <Image source={images[2]} resizeMode="contain" style={styles.image} />
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
          <Pressable onPress={endOnboarding} style={{ marginRight: 32, marginBottom: 52 }}>
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
    marginTop: 10,
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

export default WardOnboardingPage;
