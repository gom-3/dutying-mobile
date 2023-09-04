import MonthSelector from '@components/MonthSelector';
import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { COLOR } from 'index.style';
import { View, Text, Switch, StyleSheet, Pressable, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ImageIcon from '@assets/svgs/image-save.svg';
import LinkIcon from '@assets/svgs/link.svg';
import Header from '@pages/HomePage/components/Header';
import Calendar from '@pages/HomePage/components/Calendar';
import { useEffect, useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import FullLogoIcon from '@assets/svgs/logo-full.svg';
import * as Sharing from 'expo-sharing';
import ShiftTypeGuide from './components/ShiftTypeGuide';

const SharePage = () => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [guideSwitch, setGuideSwitch] = useState(false);
  const [scheduleSwitch, setScheduleSwitch] = useState(false);

  const viewRef = useRef<any>(null);

  useEffect(() => {
    if (isImageModalVisible) {
      viewRef.current?.capture().then((uri: any) => {
        Sharing.shareAsync(uri).then(() => setIsImageModalVisible(false));
      });
    }
  }, [isImageModalVisible]);

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <PageHeader title="공유하기" />
          <View style={styles.pageContextView}>
            <View>
              <MonthSelector style={{ marginLeft: 26, marginTop: 24 }} />
              <View style={styles.item}>
                <Text>개인 일정 포함하기</Text>
                <Switch
                  trackColor={{ true: COLOR.main1 }}
                  thumbColor="white"
                  value={scheduleSwitch}
                  onValueChange={(value) => setScheduleSwitch(value)}
                />
              </View>
              <View style={styles.typeItem}>
                <View style={styles.typeItemHeader}>
                  <Text>근무 유형별 안내 포함하기</Text>
                  <Switch
                    trackColor={{ true: COLOR.main1 }}
                    thumbColor="white"
                    value={guideSwitch}
                    onValueChange={(value) => setGuideSwitch(value)}
                  />
                </View>
                {guideSwitch && (
                  <View>
                    <Text
                      style={styles.guideText}
                    >{`예시) 캘린더 하단에 근무 유형별 안내가 삽입됩니다.`}</Text>
                    <ShiftTypeGuide />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => setIsImageModalVisible(true)}>
                <ImageIcon />
                <Text style={styles.buttonText}>이미지로 저장하기</Text>
              </Pressable>
              <Pressable style={styles.button}>
                <LinkIcon />
                <Text style={styles.buttonText}>링크로 공유하기</Text>
              </Pressable>
            </View>
          </View>
          <Modal animationType="slide" visible={isImageModalVisible}>
            <SafeAreaProvider>
              <SafeAreaView>
                <ViewShot
                  style={{ backgroundColor: 'white' }}
                  ref={viewRef}
                  options={{ fileName: 'dutying', format: 'png', quality: 1 }}
                >
                  <View style={styles.header}>
                    <FullLogoIcon />
                  </View>
                  <Header isImage />
                  <Calendar withoutSchedule={true}/>
                  {guideSwitch && (
                    <View style={styles.typeItem}>
                      <ShiftTypeGuide />
                    </View>
                  )}
                </ViewShot>
              </SafeAreaView>
            </SafeAreaProvider>
          </Modal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  guideText: {
    fontFamily: 'Apple',
    color: COLOR.sub3,
    fontSize: 12,
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'flex-end',
    paddingRight: 24,
    paddingTop: 24,
  },
  pageContextView: {
    justifyContent: 'space-between',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomColor: COLOR.sub4,
    borderBottomWidth: 0.5,
  },
  typeItem: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomColor: COLOR.sub4,
    borderBottomWidth: 0.5,
  },
  typeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 24,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.main2,
    borderWidth: 1,
    borderRadius: 5,
    padding: 13,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Apple',
    fontSize: 16,
    color: COLOR.main1,
    marginLeft: 11,
  },
});

export default SharePage;
