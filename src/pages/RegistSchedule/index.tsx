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
import { ReactNode } from 'react';

const RegistSchedulePage = () => {
  const {
    state: { titleText, ref },
    actions: { titleInputChangeHandler, createEvent, backToPrevPage },
  } = useSchedulePopup();

  const KeyboradAvoidWrapper = ({ children }: { children: ReactNode }) => {
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
          enableOnAndroid={true}
          extraScrollHeight={50}
          resetScrollToCoords={{ x: 0, y: 0 }}
          style={styles.container}
        >
          {children}
        </KeyboardAwareScrollView>
      );
  };

  return (
    <PageViewContainer>
      <SafeAreaView>
        <KeyboradAvoidWrapper>
          <View style={styles.header}>
            <Pressable onPress={backToPrevPage}>
              <PrevIcon />
            </Pressable>
            <Text style={styles.headerTitle}>일정 등록</Text>
            <Pressable>
              <CheckIcon onPress={createEvent} />
            </Pressable>
          </View>
          <TextInput
            autoFocus
            value={titleText}
            onChangeText={titleInputChangeHandler}
            style={styles.title}
            placeholder="제목"
            placeholderTextColor={COLOR.sub3}
          />
          <Time />
          <Alarm />
          <Repeat />
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
      </SafeAreaView>
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
    margin: 24,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 10,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
});

export default RegistSchedulePage;
