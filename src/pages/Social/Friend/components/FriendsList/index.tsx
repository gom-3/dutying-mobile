import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import UnderArrowIcon from '@assets/svgs/under-arrow-black.svg';
import { COLOR } from 'index.style';
import { useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import AlertModal from '@components/AlertModal';
import { Friend } from '@libs/api/friend';
import useFriendsList from './index.hook';

interface Props {
  friends: Friend[] | undefined;
}

const FriendsList = ({ friends }: Props) => {
  const {
    states: { currentFriend, account, isDeleteModalOpen, friendListRef },
    actions: {
      pressBackdrop,
      closeDeleteModal,
      acceptDeleteFriend,
      pressDeleteButton,
      openFriendsListBottomSheet,
    },
  } = useFriendsList();

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop onPress={pressBackdrop} {...props} />,
    [],
  );

  return (
    <View>
      <AlertModal
        text={`${currentFriend?.name}님을 삭제하시겠어요?`}
        highlight={`${currentFriend?.name}`}
        subText={`상대방도 ${account.name}님과 친구가 아니게됩니다.`}
        isOpen={isDeleteModalOpen}
        close={closeDeleteModal}
        accept={acceptDeleteFriend}
        cancelText="취소"
        acceptText="네"
      />
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        handleIndicatorStyle={{ backgroundColor: COLOR.sub45, width: 50 }}
        ref={friendListRef}
        snapPoints={[300, 550, 700]}
        index={1}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          <Text style={{ fontFamily: 'Apple', fontSize: 16, color: COLOR.sub2 }}>친구들</Text>
        </View>
        <View style={{ marginLeft: 24, marginTop: 24, marginBottom: 16 }}>
          <Text style={{ color: COLOR.sub3, fontFamily: 'Apple500', fontSize: 12 }}>
            총 {friends?.length}명
          </Text>
        </View>
        <ScrollView>
          {friends?.map((friend) => (
            <View key={`friends ${friend.accountId}`} style={styles.member}>
              <View style={styles.memberProfile}>
                <Image
                  source={{ uri: `data:image/png;base64,${friend.profileImgBase64}` }}
                  style={styles.memberProfileImage}
                />
                <Text>{friend.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => pressDeleteButton(friend)}
                style={{
                  borderColor: COLOR.sub3,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: COLOR.sub3, fontFamily: 'Apple500', fontSize: 12 }}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </BottomSheetModal>
      <TouchableOpacity
        onPress={openFriendsListBottomSheet}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={styles.sectionTitle}>친구들</Text>
        <UnderArrowIcon style={{ marginLeft: 5 }} width={12} height={12} />
      </TouchableOpacity>
      <Text style={styles.sectionDesc}>근무가 궁금한 친구들을 모아볼 수 있어요!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default FriendsList;
