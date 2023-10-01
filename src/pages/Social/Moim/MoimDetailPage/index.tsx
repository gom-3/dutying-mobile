import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DotsIcon from '@assets/svgs/dots.svg';
import { images } from '@assets/images/profiles';
import { COLOR } from 'index.style';
import { useState } from 'react';
import Summary from './components/Summary';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Collection from './components/Collection';

const MoimDetailPage = () => {
  const [tab, setTab] = useState<'summary' | 'collection' | 'weekly'>('summary');
  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader
            title=""
            rightItems={
              <TouchableOpacity>
                <DotsIcon />
              </TouchableOpacity>
            }
          />

          <View style={styles.moimWrapper}>
            <Text style={styles.moimName}>곰세마리 병동 동기</Text>
            <View style={styles.profileImages}>
              {[1, 2, 3].map((_, i) => (
                <Image
                  key={i}
                  style={[styles.profileImage, { right: 0 + (3 - i) * 18 }]}
                  source={images[i * 3]}
                />
              ))}
            </View>
          </View>
          <Text style={styles.moimHospital}>소마 병원</Text>
          <View style={styles.tab}>
            <TouchableOpacity
              onPress={() => setTab('summary')}
              style={[
                styles.tabItem,
                {
                  borderBottomWidth: tab === 'summary' ? 2 : 1,
                  borderBottomColor: tab === 'summary' ? COLOR.main1 : COLOR.sub45,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: tab === 'summary' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: tab === 'summary' ? 'Apple600' : 'Apple500',
                }}
              >
                요약보기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('collection')}
              style={[
                styles.tabItem,
                {
                  borderBottomWidth: tab === 'collection' ? 2 : 1,
                  borderBottomColor: tab === 'collection' ? COLOR.main1 : COLOR.sub45,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: tab === 'collection' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: tab === 'collection' ? 'Apple600' : 'Apple500',
                }}
              >
                월별 모아보기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('weekly')}
              style={[
                styles.tabItem,
                {
                  borderBottomWidth: tab === 'weekly' ? 2 : 1,
                  borderBottomColor: tab === 'weekly' ? COLOR.main1 : COLOR.sub45,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: tab === 'weekly' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: tab === 'weekly' ? 'Apple600' : 'Apple500',
                }}
              >
                주간 모아보기
              </Text>
            </TouchableOpacity>
          </View>
          <Summary isVisible={tab === 'summary'} />
          <Collection isVisible={tab === 'collection'} />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  moimWrapper: {
    paddingHorizontal: 24,
  },
  moimName: {
    color: '#150b3c',
    fontSize: 24,
    fontFamily: 'Apple500',
  },
  moimHospital: {
    marginTop: 8,
    marginLeft: 24,
    color: COLOR.sub25,
    fontFamily: 'Apple',
    fontSize: 14,
  },
  profileImages: {
    flexDirection: 'row',
    position: 'relative',
  },
  profileImage: {
    width: 28,
    height: 28,
    position: 'absolute',
    bottom: -15,
  },
  tab: {
    flexDirection: 'row',
    marginTop: 22,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default MoimDetailPage;
