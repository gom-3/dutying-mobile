import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import CheckIcon from '@assets/svgs/check.svg';
import { COLOR, screenHeight, screenWidth } from 'index.style';
import Time from './components/Time';
import Alarm from './components/Alarm';
import Repeat from './components/Repeat';
import useRegistSchedule from './index.hook';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { ReactNode } from 'react';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ModalContext from './components/ModalContext';
import PageHeader from '@components/PageHeader';
import { useRoute } from '@react-navigation/native';
import TrashIcon from '@assets/svgs/trash.svg';
import Category from './components/Category';

export const KeyboradAvoidWrapper = React.forwardRef<ScrollView, { children: ReactNode }>(
  (props, ref) => {
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
  },
);

const RegistSchedulePage = () => {
  const route = useRoute<any>();
  const { params } = route;
  const isEdit = params ? params.isEdit : false;
  const {
    state: { title, ref, startDate, isModalOpen, modalRef, notes },
    actions: {
      titleChangeHandler,
      createEvent,
      updateEvent,
      deleteEvent,
      openModal,
      notesChangeHandler,
      closeModal,
    },
  } = useRegistSchedule(isEdit);

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <KeyboradAvoidWrapper ref={ref}>
            <PageHeader
              title={isEdit ? '일정 수정' : '일정 등록'}
              titleMargin={isEdit ? 38 : 0}
              rightItems={
                <View style={styles.headerIcons}>
                  {isEdit && (
                    <Pressable style={styles.trashIcon} onPress={deleteEvent}>
                      <TrashIcon />
                    </Pressable>
                  )}
                  <Pressable onPress={isEdit ? updateEvent : createEvent}>
                    <CheckIcon />
                  </Pressable>
                </View>
              }
            />

            <TextInput
              autoFocus={Platform.OS === 'android'}
              value={title}
              onChangeText={titleChangeHandler}
              style={styles.title}
              placeholder="제목"
              placeholderTextColor={COLOR.sub3}
            />
            {!isEdit && <Category />}
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
              value={notes}
              onChangeText={notesChangeHandler}
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
  headerIcons: {
    flexDirection: 'row',
  },
  trashIcon: {
    marginRight: 14,
  },
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
