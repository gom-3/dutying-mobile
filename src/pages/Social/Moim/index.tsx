import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { COLOR } from 'index.style';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlusIcon from '@assets/svgs/plus-circle.svg';
import BottomSheetHeader from '@components/BottomSheetHeader';
import CheckIcon from '@assets/svgs/check.svg';
import { useCallback, useRef } from 'react';
import useMoimPage from './index.hook';

const MoimPage = () => {
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);
  const {
    states: { moimList, enteredInput, createRef, textInputRef },
    actions: { setEnteredInput, pressMoimCard, pressCheck },
  } = useMoimPage();

  return (
    <PageViewContainer style={{ backgroundColor: '#fdfcfe' }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable>
              <Text style={[styles.headerText, { color: COLOR.sub25, fontFamily: 'Apple500' }]}>
                친구
              </Text>
            </Pressable>
            <Pressable>
              <Text
                style={[
                  styles.headerText,
                  {
                    marginLeft: 18,
                    color: COLOR.main1,
                    fontFamily: 'Apple600',
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                모임
              </Text>
            </Pressable>
          </View>
          <View style={styles.textWrapper}>
            <View>
              <Text style={styles.countText}>총 {moimList?.length}모임</Text>
              <Text style={styles.guideText}>
                모임을 만들어 친구들의 근무표를 한번에 볼 수 있어요.
              </Text>
            </View>
          </View>
          <ScrollView style={styles.cardScrollView}>
            {moimList?.map((moim) => (
              <View key={moim.moimId}>
                <TouchableOpacity
                  style={styles.shadowWrapper}
                  onPress={() => pressMoimCard(moim.moimId)}
                >
                  <View>
                    <Text style={styles.titleText}>{moim.moimName}</Text>
                    <Text style={styles.ownerText}>모임장 {moim.hostInfo.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', position: 'relative' }}>
                    {moim.memberInfoList.map((member, i) => (
                      <Image
                        key={i}
                        style={[styles.profile, { right: 0 + (moim.memberCount - i) * 18 }]}
                        source={{ uri: `data:image/png;base64,${member.profileImgBase64}` }}
                      />
                    ))}
                    {moim.memberCount > 4 && (
                      <View style={styles.profileCount}>
                        <Text style={styles.profileCountText}>+{moim.memberCount - 3}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => createRef.current?.present()}>
              <View style={styles.addButton}>
                <PlusIcon />
                <Text style={styles.addButtonText}>새로운 모임 생성하기</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        <BottomSheetModal
          backdropComponent={renderBackdrop}
          index={1}
          ref={createRef}
          handleComponent={null}
          snapPoints={[100, 300]}
          keyboardBehavior="interactive"
          onChange={(index) => {
            if (index !== 1) createRef.current?.close();
          }}
        >
          <View style={{ padding: 14 }}>
            <BottomSheetHeader
              title="모임 생성하기"
              onPressExit={() => createRef.current?.close()}
              rightItems={
                <Pressable onPress={pressCheck}>
                  <CheckIcon />
                </Pressable>
              }
            />
            <View style={{ padding: 10 }}>
              <BottomSheetTextInput
                style={styles.input}
                onChangeText={(text) => {
                  textInputRef.current = text;
                }}
              />
            </View>
          </View>
        </BottomSheetModal>
        <NavigationBar page="social" />
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR.main4,
    width: '100%',
    fontSize: 20,
    fontFamily: 'Apple',
    color: COLOR.sub1,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  header: {
    marginTop: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  countText: {
    fontFamily: 'Apple',
    fontSize: 12,
    color: COLOR.sub2,
  },
  guideText: {
    fontFamily: 'Apple',
    fontSize: 10,
    color: COLOR.sub3,
    marginTop: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionText: {
    fontFamily: 'Apple',
    fontSize: 12,
    color: COLOR.sub2,
    marginLeft: 2,
    textDecorationLine: 'underline',
  },
  cardScrollView: {
    height: '80%',
  },
  shadowWrapper: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: Platform.OS === 'android' ? '#b497ee' : '#ede9f5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    height: 70,
    elevation: 8,
    padding: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardItem: {},
  titleText: {
    color: COLOR.sub1,
    fontSize: 20,
    fontFamily: 'Apple600',
  },
  ownerText: {
    color: COLOR.sub25,
    fontFamily: 'Apple',
    fontSize: 12,
    marginTop: 8,
  },
  profile: {
    width: 28,
    height: 28,
    position: 'absolute',
    bottom: -15,
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
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.main3,
    margin: 24,
    padding: 12,
  },
  addButtonText: {
    fontFamily: 'Apple',
    fontSize: 14,
    color: COLOR.main1,
    marginLeft: 7,
  },
  bookmark: {
    position: 'absolute',
    top: 8,
    right: 25,
    width: 30,
    height: 30,
  },
});

export default MoimPage;
