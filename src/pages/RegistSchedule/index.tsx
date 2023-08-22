import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PrevIcon from '@assets/svgs/back-arrow.svg';
import CheckIcon from '@assets/svgs/check.svg';
import { COLOR, screenHeight, screenWidth } from 'index.style';
import Time from './components/Time';
import Alarm from './components/Alarm';
import Repeat from './components/Repeat';
import useSchedulePopup from './index.hook';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { ReactNode, useMemo } from 'react';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ModalContext from './components/ModalContext';

const KeyboradAvoidWrapper = React.forwardRef<ScrollView, { children: ReactNode }>((props, ref) => {
  const { children } = props;
  if (Platform.OS === 'android')
    return (
      <KeyboardAvoidingView behavior="height">
        <ScrollView style={styles.container} ref={ref}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  else
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        resetScrollToCoords={{ x: 0, y: 0 }}
        style={styles.container}
      >
        {children}
      </KeyboardAwareScrollView>
    );
});

const RegistSchedulePage = () => {
  const {
    state: { titleText, ref, startDate, isModalOpen, modalRef },
    actions: { titleInputChangeHandler, createEvent, backToPrevPage, openModal, closeModal },
  } = useSchedulePopup();

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <KeyboradAvoidWrapper ref={ref}>
            <View style={styles.header}>
              <Pressable onPress={backToPrevPage}>
                <PrevIcon />
              </Pressable>
              <Text style={styles.headerTitle}>일정 등록</Text>
              <Pressable>
                <CheckIcon onPress={createEvent} />
              </Pressable>
            </View>
            <Text style={styles.yearText}>{startDate.getFullYear()}</Text>
            <Text style={styles.dateText}>
              {startDate.getMonth() + 1}월 {startDate.getDate()}일
            </Text>
            <TextInput
              autoFocus={Platform.OS === 'android'}
              value={titleText}
              onChangeText={titleInputChangeHandler}
              style={styles.title}
              placeholder="제목"
              placeholderTextColor={COLOR.sub3}
            />
            <Time />
            <Alarm openModal={() => openModal('alarm')} />
            <Repeat openModal={() => openModal('reculsive')} />
            <Text
              style={{
                color: COLOR.sub3,
                fontFamily: 'Apple',
                fontSize: 16,
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderTopColor: '#d6d6de',
                borderTopWidth: 0.5,
              }}
            >
              메모
            </Text>
            <TextInput
              multiline
              onFocus={() => ref.current?.scrollToEnd()}
              style={{
                backgroundColor: COLOR.bg,
                borderColor: COLOR.sub5,
                borderWidth: 0.5,
                marginHorizontal: 24,
                borderRadius: 5,
                minHeight: 169,
              }}
            />
          </KeyboradAvoidWrapper>
          <BottomSheetModal
            ref={modalRef}
            index={1}
            snapPoints={[200, 350]}
            handleComponent={null}
            onChange={(index) => {
              if (index !== 1) closeModal();
            }}
          >
            <ModalContext closeModal={closeModal} />
          </BottomSheetModal>
          {isModalOpen && (
            <Pressable
              style={{
                backgroundColor: 'black',
                opacity: 0.5,
                width: screenWidth,
                height: screenHeight,
                position: 'absolute',
              }}
              onPress={closeModal}
            />
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: screenHeight,
    width: screenWidth,
  },
  header: {
    margin: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontFamily: 'Apple', fontSize: 16, color: COLOR.sub2 },
  title: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: COLOR.bg,
    borderWidth: 0.5,
    borderColor: COLOR.sub5,
    borderRadius: 5,
    fontSize: 20,
    fontFamily: 'Apple',
    color: COLOR.sub1,
    marginHorizontal: 24,
    marginVertical: 14,
  },
  yearText: {
    fontSize: 12,
    marginTop: 20,
    marginLeft: 24,
    fontFamily: 'Apple',
    color: COLOR.sub2,
  },
  dateText: {
    fontSize: 24,
    marginLeft: 24,
    fontFamily: 'Poppins500',
    color: COLOR.sub2,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
});

export default RegistSchedulePage;
