import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { TouchableOpacity, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DotsIcon from '@assets/svgs/dots.svg';
import { images } from '@assets/images/profiles';
import { COLOR } from 'index.style';
import { useCallback, useRef, useState } from 'react';
import Summary from './components/Summary';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Collection from './components/Collection';
import Actions from './components/Actions';

const mockMembers = ['김범진', '황인서', '김찬규', '조성연', '류원경', '강명구', '안재홍'];

const MoimDetailPage = () => {
  const [tab, setTab] = useState<'summary' | 'collection' | 'weekly'>('summary');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  console.log(1);
  const memberRef = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader
            title=""
            rightItems={
              <TouchableOpacity onPress={() => setIsActionsOpen(!isActionsOpen)}>
                <DotsIcon />
              </TouchableOpacity>
            }
          />
          <View style={styles.moimWrapper}>
            <Text style={styles.moimName}>곰세마리 병동 동기</Text>
            <TouchableOpacity
              onPress={() => memberRef.current?.present()}
              style={styles.profileImages}
            >
              {mockMembers.slice(0, 3).map((_, i) => (
                <Image
                  key={i}
                  style={[styles.profileImage, { right: 0 + (3 - i) * 18 }]}
                  source={images[i * 3]}
                />
              ))}
              {mockMembers.length - 3 > 0 && (
                <View style={styles.profileCount}>
                  <Text style={styles.profileCountText}>+{mockMembers.length - 3}</Text>
                </View>
              )}
            </TouchableOpacity>
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
          {tab === 'summary' && <Summary isVisible={tab === 'summary'} />}
          {tab === 'collection' && <Collection isVisible={tab === 'collection'} />}
          <Actions isActionOpen={isActionsOpen} close={() => setIsActionsOpen(false)} />
          <BottomSheetModal
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: COLOR.sub45, width: 50 }}
            ref={memberRef}
            snapPoints={[100, 350, 700]}
            index={1}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ fontFamily: 'Apple', fontSize: 16, color: COLOR.sub2 }}>모임원</Text>
            </View>
            <ScrollView>
              {mockMembers.map((name, i) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderBottomColor: COLOR.sub45,
                    borderBottomWidth: 0.5,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={images[i]} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <Text>{name}</Text>
                  </View>
                  {i === 0 && (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 30,
                        borderColor: COLOR.main1,
                        borderWidth: 1,
                      }}
                    >
                      <Text style={{ color: COLOR.main1, fontFamily: 'Apple', fontSize: 12 }}>
                        모임장
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </BottomSheetModal>
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
  profileCount: {
    position: 'absolute',
    right: 0,
    bottom: -15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.main1,
    borderRadius: 100,
  },
  profileCountText: {
    fontFamily: 'Apple',
    color: 'white',
    fontSize: 14,
  },
});

export default MoimDetailPage;
