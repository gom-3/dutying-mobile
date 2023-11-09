import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { COLOR } from 'index.style';
import { Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MailIcon from '@assets/svgs/mail.svg';
import FreindIcon from '@assets/svgs/add-friend.svg';
import ArrowLeftIcon from '@assets/svgs/arrow-left.svg';
import ArrowRightIcon from '@assets/svgs/arrow-right.svg';
import { useCallback } from 'react';
import { AlertModalInvite } from '@components/AlertModal';
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import useFriendPage from './index.hook';
import TodayShift from './components/Today';
import FriendsList from './components/FriendsList';
import CollectionContoller from './components/CollectionController';
import CollectionTable from './components/CollectionTable';
import SelectedFriends from './components/SelectedFriends';
import LottieLoading from '@components/LottieLoading';

const weekEnum = ['첫째 주', '둘째 주', '셋째 주', '넷째 주', '다섯째 주', '여섯째 주'];

const NoFriend = (
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text style={{ color: COLOR.sub3, fontSize: 14, fontFamily: 'Apple' }}>
      아직 친구가 없어요.
    </Text>
    <Text style={{ color: COLOR.sub3, fontSize: 14, fontFamily: 'Apple' }}>
      코드를 공유해서 친구를 만들어보세요!
    </Text>
  </View>
);

const FriendsPage = () => {
  const {
    states: {
      friends,
      favoriteFriends,
      account,
      isIniviteModalOpen,
      date,
      currentWeek,
      isBottomSheetOpen,
      isLoading,
    },
    actions: {
      pressBackdrop,
      setIsInviteModalOpen,
      navigateMoimPage,
      navigateRequestPage,
      setState,
    },
  } = useFriendPage();
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop onPress={pressBackdrop} {...props} />,
    [],
  );

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <BottomSheetModalProvider>
        <AlertModalInvite
          text="내 코드 공유하기"
          subText="아래 코드를 입력하면 나와 친구를 맺을 수 있어요!"
          code={account.code || ''}
          close={() => setIsInviteModalOpen(false)}
          isOpen={isIniviteModalOpen}
        />
        <SafeAreaView>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={navigateMoimPage}>
                <Text style={styles.headerText}>모임</Text>
              </Pressable>
              <Pressable>
                <Text
                  style={[
                    styles.headerText,
                    {
                      color: COLOR.main1,
                      fontFamily: 'Apple600',
                      marginLeft: 18,
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  친구
                </Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setIsInviteModalOpen(true)}
                style={[
                  styles.headerIcon,
                  {
                    marginRight: 15,
                  },
                ]}
              >
                <MailIcon />
                <Text style={styles.headerIconText}>코드 공유</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateRequestPage} style={styles.headerIcon}>
                <FreindIcon />
                <Text style={styles.headerIconText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginLeft: 24, marginBottom: 16, marginTop: 18 }}>
            <View>
              <Text style={styles.sectionTitle}>오늘의 근무</Text>
              <Text style={styles.sectionDesc}>친구들의 근무는 무엇일까요?</Text>
            </View>
          </View>
          {friends && friends.length > 0 ? <TodayShift /> : NoFriend}
          <View style={{ height: 1, backgroundColor: '#e7e7ef', marginVertical: 16 }} />
          <View
            style={{
              marginHorizontal: 24,
              marginBottom: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FriendsList friends={friends} />
            <CollectionContoller backdrop={renderBackdrop} friends={friends} />
          </View>
          {favoriteFriends && favoriteFriends?.length > 0 && (
            <SelectedFriends favoriteFriends={favoriteFriends} />
          )}
          {friends && friends.length > 0 ? (
            <View>
              <View style={styles.weekNumber}>
                <Text style={styles.weekNumberText}>
                  {`${date.getMonth() + 1}월 `}
                  {weekEnum[currentWeek]}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setState(
                      'date',
                      new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
                    )
                  }
                >
                  <ArrowLeftIcon width={40} height={40} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setState(
                      'date',
                      new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
                    )
                  }
                >
                  <ArrowRightIcon width={40} height={40} />
                </TouchableOpacity>
              </View>
              <CollectionTable />
            </View>
          ) : (
            <View style={{ marginTop: 50 }}>{NoFriend}</View>
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
      {!isBottomSheetOpen && <NavigationBar page="social" />}
      {isLoading && <LottieLoading />}
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: COLOR.sub3,
    fontFamily: 'Apple500',
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  headerIconText: { fontSize: 12, fontFamily: 'Apple500', color: COLOR.main2 },
  sectionTitle: {
    color: COLOR.sub1,
    fontFamily: 'Apple600',
    fontSize: 16,
  },
  sectionDesc: {
    marginTop: 4,
    color: COLOR.sub3,
    fontFamily: 'Apple',
    fontSize: 10,
  },
  weekNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 16,
  },
  weekNumberText: {
    color: COLOR.main1,
    fontSize: 14,
    fontFamily: 'Apple500',
  },
  week: {
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  weekDateWrapper: {
    flex: 1,
    margin: 5,
  },
  weekDate: {
    margin: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    height: 58,
    paddingBottom: 6,
    backgroundColor: COLOR.sub5,
    borderRadius: 5,
  },
  weekDateText: { fontFamily: 'Poppins', fontSize: 12 },
  memberView: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomColor: COLOR.main4,
    borderBottomWidth: 0.5,
  },
  memberName: {
    flex: 1,
    borderRadius: 3,
    paddingVertical: 2,
    backgroundColor: COLOR.main4,
  },
  memberNameText: {
    fontSize: 12,
    fontFamily: 'Apple500',
    color: COLOR.sub1,
    textAlign: 'center',
  },
  shiftText: {
    fontFamily: 'Apple',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
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
  memberProfileImage: { width: 24, height: 24, marginRight: 8, borderRadius: 50 },
});

export default FriendsPage;
