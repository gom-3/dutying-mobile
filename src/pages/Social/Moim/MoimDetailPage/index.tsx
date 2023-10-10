import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DotsIcon from '@assets/svgs/dots.svg';
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
import { useQuery } from '@tanstack/react-query';
import { useMoimStore } from '../store';
import { getMoimCollection, getMoimMembers } from '@libs/api/moim';
import { useCaledarDateStore } from 'store/calendar';
import PlusIcon from '@assets/svgs/plus.svg';
import { AlertModalInvite } from '@components/AlertModal';
import { useAccountStore } from 'store/account';

const MoimDetailPage = () => {
  const [tab, setTab] = useState<'summary' | 'collection' | 'weekly'>('summary');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [date] = useCaledarDateStore((state) => [state.date]);
  const memberRef = useRef<BottomSheetModal>(null);
  const [moimId] = useMoimStore((state) => [state.moimId]);
  const [account] = useAccountStore(state=>[state.account]);
  const { data: moim } = useQuery(['getMemberList', moimId], () => getMoimMembers(moimId), {
    enabled: moimId !== 0,
  });

  const { data: moimCollection } = useQuery(
    ['getMoimCollection', moimId, date.getFullYear(), date.getMonth()],
    () => getMoimCollection(moimId, date.getFullYear(), date.getMonth()),
  );

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
    memberRef.current?.close();
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    memberRef.current?.present();
  };

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);
  if (!moim)
    return (
      <View>
        <ActivityIndicator color={COLOR.main1} />
      </View>
    );

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <AlertModalInvite
            moimCode={moim.moimCode}
            isOpen={isInviteModalOpen}
            close={closeInviteModal}
          />
          <PageHeader
            title=""
            rightItems={
              <TouchableOpacity onPress={() => setIsActionsOpen(!isActionsOpen)}>
                <DotsIcon />
              </TouchableOpacity>
            }
          />
          <View style={styles.moimWrapper}>
            <Text style={styles.moimName}>{moim.moimName}</Text>
            <TouchableOpacity
              onPress={() => memberRef.current?.present()}
              style={styles.profileImages}
            >
              {moim?.memberInfoList
                .slice(0, 3)
                .map((member, i) => (
                  <Image
                    key={i}
                    style={[
                      styles.profileImage,
                      { right: 0 + (Math.min(3, moim.memberCount) - i) * 18 },
                    ]}
                    source={{ uri: `data:image/png;base64,${member.profileImgBase64}` }}
                  />
                ))}
              {moim && moim.memberCount > 4 && (
                <View style={styles.profileCount}>
                  <Text style={styles.profileCountText}>+{moim.memberCount - 3}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
                모아보기
              </Text>
            </TouchableOpacity>
          </View>
          {tab === 'summary' && moimCollection && <Summary collection={moimCollection} />}
          {tab === 'collection' && <Collection collection={moimCollection} />}
          <Actions moim={moim} isActionOpen={isActionsOpen} close={() => setIsActionsOpen(false)} />
          <BottomSheetModal
            backdropComponent={renderBackdrop}
            enableContentPanningGesture={false}
            handleIndicatorStyle={{ backgroundColor: COLOR.sub45, width: 50 }}
            ref={memberRef}
            snapPoints={[100, 350, 700]}
            index={1}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}
            >
              <View style={{ width: 24 }} />
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetHeaderText}>모임원</Text>
              </View>
              <TouchableOpacity onPress={openInviteModal}>
                <View
                  style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
                >
                  <PlusIcon />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {moim.memberInfoList.map((member, i) => (
                <View key={`change host ${member.accountId}`} style={styles.member}>
                  <View style={styles.memberProfile}>
                    <Image
                      source={{ uri: `data:image/png;base64,${member.profileImgBase64}` }}
                      style={styles.memberProfileImage}
                    />
                    <Text>{member.name}</Text>
                  </View>
                </View>
              ))}
              <View style={{ height: 400 }} />
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
  bottomSheetHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  bottomSheetHeaderText: {
    fontFamily: 'Apple',
    fontSize: 16,
    color: COLOR.sub2,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: COLOR.sub45,
    borderBottomWidth: 0.5,
  },
  memberProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberProfileImage: { width: 24, height: 24, marginRight: 8 },
});

export default MoimDetailPage;
