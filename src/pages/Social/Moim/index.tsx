import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { COLOR, screenHeight, screenWidth } from 'index.style';
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
import EnterIcon from '@assets/svgs/enter.svg';
import { useCallback } from 'react';
import useMoimPage from './index.hook';
import { hexToRgba } from '@libs/utils/color';
import LottieView from 'lottie-react-native';

const MoimPage = () => {
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);
  const {
    states: { moimList, createRef, isValid, moimNameRef, isLoading, isRefetching, createLoading },
    actions: { pressMoimCard, pressCheck, navigateMoimEnter, setIsValid, closeBottomSheet },
  } = useMoimPage();

  return (
    <PageViewContainer style={{ backgroundColor: '#fdfcfe' }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable>
              <Text
                style={[
                  styles.headerText,
                  {
                    color: COLOR.main1,
                    fontFamily: 'Apple600',
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                모임
              </Text>
            </Pressable>
            <TouchableOpacity
              onPress={() => navigateMoimEnter()}
              style={{ width: 35, height: 40, alignItems: 'center', justifyContent: 'center' }}
            >
              <EnterIcon />
              <Text style={{ fontSize: 12, fontFamily: 'Apple500', color: COLOR.main2 }}>입장</Text>
            </TouchableOpacity>
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
                  onPress={() => pressMoimCard(moim.moimId, moim.moimCode)}
                >
                  <View>
                    <Text style={styles.titleText}>{moim.moimName}</Text>
                    <Text style={styles.ownerText}>모임장 {moim.hostInfo.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', position: 'relative' }}>
                    {moim.memberInfoList.map((member, i) => (
                      <Image
                        key={i}
                        style={[
                          styles.profile,
                          {
                            right:
                              (Math.min(
                                3,
                                moim.memberCount > 4 ? moim.memberCount : moim.memberCount - 1,
                              ) -
                                i) *
                              18,
                          },
                        ]}
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
          enableContentPanningGesture={false}
          handleComponent={null}
          snapPoints={[100, 300]}
          keyboardBehavior="interactive"
          onChange={(index) => {
            if (index !== 1) closeBottomSheet();
          }}
        >
          <View style={{ padding: 14 }}>
            <BottomSheetHeader
              title="모임 생성하기"
              onPressExit={() => closeBottomSheet()}
              rightItems={
                <TouchableOpacity onPress={pressCheck}>
                  <CheckIcon />
                </TouchableOpacity>
              }
            />
            <View style={{ padding: 10 }}>
              <BottomSheetTextInput
                autoFocus
                style={[
                  styles.input,
                  { borderColor: isValid ? COLOR.main4 : hexToRgba('#ff4a80', 0.7) },
                ]}
                placeholder="모임 이름"
                maxLength={12}
                onChangeText={(text) => {
                  moimNameRef.current = text;
                  setIsValid(true);
                }}
              />
            </View>
            {!isValid && (
              <Text
                style={{
                  paddingHorizontal: 20,
                  color: '#ff4a80',
                  fontSize: 14,
                  fontFamily: 'Apple',
                }}
              >
                올바른 입력이 아닙니다. 다시 한번 확인해주세요.
              </Text>
            )}
          </View>
        </BottomSheetModal>
        <NavigationBar page="social" />
      </BottomSheetModalProvider>
      {(isLoading || createLoading) && (
        <View
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: hexToRgba('#000000', 0.3),
            left: 0,
            top: 0,
            zIndex: 100,
          }}
        >
          <LottieView
            style={{ width: 200, height: 200 }}
            source={require('@assets/animations/signup-animation.json')}
            autoPlay
            loop
          />
        </View>
      )}
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
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 18,
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
    borderRadius: 50,
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
