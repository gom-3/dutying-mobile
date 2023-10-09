import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { COLOR } from 'index.style';
import { useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import PlusIcon from '@assets/svgs/plus.svg';
import AlertModal, { AlertModalInvite } from '@components/AlertModal';
import useAction from './index.hook';

interface Props {
  moim: Moim;
  isActionOpen: boolean;
  close: () => void;
}

const Actions = ({ isActionOpen, moim, close }: Props) => {
  const {
    states: {
      isInviteModalOpen,
      inviteRef,
      changeRef,
      kickRef,
      name,
      isDeleteModalOpen,
      isChangeMasterModalOpen,
      isKickModalOpen,
      isOutModalOpen,
      moimCode,
      isHost,
    },
    actions: {
      openOutModal,
      closeOutModal,
      openInviteModal,
      closeInviteModal,
      setIsDeleteModalOpen,
      openBottomSheet,
      openChangeMasterModal,
      openDeleteModal,
      openKickModal,
      deleteMoimMutate,
      closeChangeMasterModal,
      closeKickModal,
      pressAccetOutModal,
    },
  } = useAction(moim, close);
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  return (
    <View style={styles.container}>
      <AlertModalInvite moimCode={moimCode} isOpen={isInviteModalOpen} close={closeInviteModal} />
      {!isHost && (
        <AlertModal
          text="모임을 탈퇴하시겠어요?"
          highlight="탈퇴"
          isOpen={isOutModalOpen}
          close={closeOutModal}
          cancelText="아니요"
          acceptText="네, 탈퇴할게요"
          accept={pressAccetOutModal}
        />
      )}
      <AlertModal
        text={`${name}님을 모임에서 내보내시겠어요?`}
        highlight={`${name}님`}
        subText="내보내시면 모임원께 알림이 가며, 관련 내용은 즉시 삭제됩니다."
        isOpen={isKickModalOpen}
        close={closeKickModal}
        cancelText="아니요"
        accept={closeKickModal}
        acceptText="네, 내보낼게요"
      />
      <AlertModal
        text="모임을 삭제하시겠어요?"
        highlight="삭제"
        subText="모임을 삭제하시면 내용은 모두 삭제되며, 모임원들도 해산됩니다."
        isOpen={isDeleteModalOpen}
        close={() => setIsDeleteModalOpen(false)}
        cancelText="아니요"
        accept={() => deleteMoimMutate()}
        acceptText="네, 내보낼게요"
      />
      <AlertModal
        text={`모임장을 ${name}님으로 변경하시겠어요?`}
        highlight={`${name}`}
        subText={`모임에 대한 모든 권한을 ${name}님께 전달합니다.`}
        isOpen={isChangeMasterModalOpen}
        close={closeChangeMasterModal}
        cancelText="아니요"
        accept={closeChangeMasterModal}
        acceptText="네, 변경할게요"
      />

      {isActionOpen && (
        <OutsidePressHandler disabled={false} onOutsidePress={close}>
          <View style={styles.items}>
            <TouchableOpacity style={styles.item} onPress={() => openBottomSheet('invite')}>
              <Text style={styles.itemText}>모임 초대</Text>
            </TouchableOpacity>
            {isHost && (
              <TouchableOpacity style={styles.item} onPress={() => openBottomSheet('change')}>
                <Text style={styles.itemText}>모임장 변경</Text>
              </TouchableOpacity>
            )}
            {isHost && (
              <TouchableOpacity style={styles.item} onPress={() => openBottomSheet('kick')}>
                <Text style={styles.itemText}>모임 내보내기</Text>
              </TouchableOpacity>
            )}
            {isHost && (
              <TouchableOpacity
                onPress={openDeleteModal}
                style={[styles.item, { borderBottomWidth: 0 }]}
              >
                <Text style={styles.itemText}>모임 삭제</Text>
              </TouchableOpacity>
            )}
            {!isHost && (
              <TouchableOpacity
                onPress={openOutModal}
                style={[styles.item, { borderBottomWidth: 0 }]}
              >
                <Text style={styles.itemText}>모임 탈퇴</Text>
              </TouchableOpacity>
            )}
          </View>
        </OutsidePressHandler>
      )}
      <BottomSheetModal
        enableContentPanningGesture={false}
        ref={inviteRef}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
        backdropComponent={renderBackdrop}
        index={1}
        snapPoints={[100, 350, 700]}
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
            <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
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
      <BottomSheetModal
        enableContentPanningGesture={false}
        ref={changeRef}
        snapPoints={[100, 350, 700]}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
        backdropComponent={renderBackdrop}
        index={1}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetHeaderText}>모임장 변경</Text>
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
              <TouchableOpacity
                onPress={() => openChangeMasterModal(member.name)}
                style={[
                  styles.changeButton,
                  {
                    borderColor:
                      moim.hostInfo.accountId === member.accountId ? COLOR.main1 : COLOR.sub3,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.changeButtonText,
                    {
                      color:
                        moim.hostInfo.accountId === member.accountId ? COLOR.main1 : COLOR.sub3,
                    },
                  ]}
                >
                  {moim.hostInfo.accountId === member.accountId ? '모임장' : '변경'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 400 }} />
        </ScrollView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={kickRef}
        enableContentPanningGesture={false}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
        snapPoints={[100, 350, 700]}
        backdropComponent={renderBackdrop}
        index={1}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetHeaderText}>모임 내보내기</Text>
        </View>
        <ScrollView>
          {moim.memberInfoList.map((member) => (
            <View key={`kick ${member.accountId}`} style={styles.member}>
              <View style={styles.memberProfile}>
                <Image
                  source={{ uri: `data:image/png;base64,${member.profileImgBase64}` }}
                  style={styles.memberProfileImage}
                />
                <Text>{member.name}</Text>
              </View>
              {moim.hostInfo.accountId === member.accountId ? (
                <View style={styles.moimHostView}>
                  <Text style={styles.moimHostText}>모임장</Text>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => ({
                    borderRadius: 5,
                    borderColor: COLOR.sub3,
                    borderWidth: 1,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: pressed ? COLOR.sub3 : 'white',
                  })}
                  onPress={() => openKickModal(member.name)}
                >
                  {({ pressed }) => (
                    <Text
                      style={{
                        color: pressed ? 'white' : COLOR.sub3,
                        fontSize: 12,
                        fontFamily: 'Apple500',
                      }}
                    >
                      내보내기
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
          ))}
          <View style={{ height: 400 }} />
        </ScrollView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80,
    right: 20,
    zIndex: 10,
  },
  items: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#848484',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 16,
    shadowOpacity: 0.25,
    elevation: 20,
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: COLOR.sub4,
    borderBottomWidth: 0.5,
  },
  itemText: {
    fontFamily: 'Apple500',
    fontSize: 16,
    color: COLOR.sub1,
  },
  bottomSheetHandleIndicator: {
    backgroundColor: COLOR.sub45,
    width: 50,
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
  changeButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 30,
    borderWidth: 1,
  },
  changeButtonText: {
    fontFamily: 'Apple',
    fontSize: 12,
  },
  moimHostView: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 30,
    borderColor: COLOR.main1,
    borderWidth: 1,
  },
  moimHostText: { color: COLOR.main1, fontFamily: 'Apple', fontSize: 12 },
});

export default Actions;
