import BottomSheetHeader from '@components/BottomSheetHeader';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { COLOR } from 'index.style';
import { useCallback, useRef, useState } from 'react';
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
import CheckIcon from '@assets/svgs/check.svg';
import AlertModal from '@components/AlertModal';
import { images } from '@assets/images/profiles';

interface Props {
  isActionOpen: boolean;
  close: () => void;
}

const Actions = ({ isActionOpen, close }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  const openBottomSheet = (sheet: 'invite' | 'change' | 'kick') => {
    if (sheet === 'invite') inviteRef.current?.present();
    if (sheet === 'change') changeRef.current?.present();
    if (sheet === 'kick') kickRef.current?.present();
    close();
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    close();
  };

  const inviteRef = useRef<BottomSheetModal>(null);
  const changeRef = useRef<BottomSheetModal>(null);
  const kickRef = useRef<BottomSheetModal>(null);

  const openKickModal = (name: string) => {
    setName(name);
    setIsKickModalOpen(true);
    kickRef.current?.close();
  };

  const closeKickModal = () => {
    setIsKickModalOpen(false);
    kickRef.current?.present();
  };

  return (
    <View style={styles.container}>
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
        accept={() => setIsDeleteModalOpen(false)}
        acceptText="네, 내보낼게요"
      />
      {isActionOpen && (
        <OutsidePressHandler disabled={false} onOutsidePress={close}>
          <View style={styles.items}>
            <TouchableOpacity style={styles.item} onPress={() => openBottomSheet('invite')}>
              <Text style={styles.itemText}>모임 초대</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => openBottomSheet('change')}>
              <Text style={styles.itemText}>모임장 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => openBottomSheet('kick')}>
              <Text style={styles.itemText}>모임 내보내기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openDeleteModal}
              style={[styles.item, { borderBottomWidth: 0 }]}
            >
              <Text style={styles.itemText}>모임 삭제</Text>
            </TouchableOpacity>
          </View>
        </OutsidePressHandler>
      )}
      <BottomSheetModal
        ref={inviteRef}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        index={1}
        snapPoints={[100, 300]}
      >
        <View style={{ padding: 14 }}>
          <BottomSheetHeader
            rightItems={
              <TouchableOpacity>
                <PlusIcon />
              </TouchableOpacity>
            }
            title="모임 초대"
            onPressExit={() => inviteRef.current?.close()}
          />
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={changeRef}
        // handleComponent={null}
        snapPoints={[100, 300]}
        backdropComponent={renderBackdrop}
        index={1}
      >
        <View style={{ padding: 14 }}>
          <BottomSheetHeader
            rightItems={
              <TouchableOpacity>
                <CheckIcon />
              </TouchableOpacity>
            }
            title="모임장 변경"
            onPressExit={() => inviteRef.current?.close()}
          />
          <ScrollView>
            {['김범진', '황인서', '김찬규', '조성연', '류원경', '강명구', '안재홍'].map(
              (name, i) => (
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
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 30,
                      borderColor: i === 0 ? COLOR.main1 : COLOR.sub3,
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: i === 0 ? COLOR.main1 : COLOR.sub3,
                        fontFamily: 'Apple',
                        fontSize: 12,
                      }}
                    >
                      {i === 0 ? '모임장' : '변경'}
                    </Text>
                  </View>
                </View>
              ),
            )}
          </ScrollView>
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={kickRef}
        handleIndicatorStyle={{ backgroundColor: COLOR.sub45, width: 50 }}
        snapPoints={[100, 350, 700]}
        backdropComponent={renderBackdrop}
        index={1}
      >
        <View style={{ marginVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Apple', fontSize: 16, color: COLOR.sub2 }}>
            모임 내보내기
          </Text>
        </View>
        <ScrollView>
          {['김범진', '황인서', '김찬규', '조성연', '류원경', '강명구', '안재홍'].map((name, i) => (
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
              {i === 0 ? (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 30,
                    borderColor: COLOR.main1,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      color: COLOR.main1,
                      fontFamily: 'Apple',
                      fontSize: 12,
                    }}
                  >
                    모임장
                  </Text>
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
                  onPress={() => openKickModal(name)}
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
});

export default Actions;
