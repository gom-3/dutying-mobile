import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Friend } from '@libs/api/friend';
import { COLOR } from 'index.style';
import { TouchableOpacity, View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import CheckCircleEmpty from '@assets/svgs/check-circle-empty.svg';
import CheckCircleFill from '@assets/svgs/check-circle-fill.svg';
import useCollectionController from './index.hook';

interface Props {
  friends: Friend[] | undefined;
  backdrop: (props: any) => JSX.Element;
}

const CollectionContoller = ({ friends, backdrop }: Props) => {
  const {
    states: { friendCollectionRef, favoriteFriends },
    actions: { openFriendsCollectionBottomSheet, pressFavoiteCheckButton },
  } = useCollectionController(friends);

  return (
    <View>
      <TouchableOpacity
        onPress={openFriendsCollectionBottomSheet}
        style={{
          flexDirection: 'row',
          borderRadius: 5,
          backgroundColor: COLOR.main4,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderColor: COLOR.main1,
        }}
      >
        <Text style={{ color: COLOR.main1, fontFamily: 'Apple600', fontSize: 14 }}>
          친구 모아보기
        </Text>
      </TouchableOpacity>
      <BottomSheetModal
        backdropComponent={backdrop}
        enableContentPanningGesture={false}
        handleIndicatorStyle={{ backgroundColor: COLOR.sub45, width: 50 }}
        ref={friendCollectionRef}
        snapPoints={[300, 550, 700]}
        index={1}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          <Text style={{ fontFamily: 'Apple', fontSize: 16, color: COLOR.sub2 }}>
            친구 모아보기
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 24,
            marginTop: 24,
            marginBottom: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: COLOR.sub3, fontFamily: 'Apple500', fontSize: 12 }}>
            총 {friends?.length}명
          </Text>
          <Text style={{ color: COLOR.main2, fontFamily: 'Apple500', fontSize: 12 }}>
            {favoriteFriends?.length}명 선택
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
                onPress={() => pressFavoiteCheckButton(friend.isFavorite, friend.accountId)}
              >
                {friend.isFavorite ? <CheckCircleFill /> : <CheckCircleEmpty />}
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default CollectionContoller;
