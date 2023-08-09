import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import ExitIcon from '@assets/svgs/exit.svg';
import CheckIcon from '@assets/svgs/check.svg';
import { COLOR } from 'index.style';
import { useCaledarDateStore } from 'store/calendar';
import Time from './items/Time';
import Alarm from './items/Alarm';
import Repeat from './items/Repeat';
import useSchedulePopup from './index.hook';

const SchedulePopup = () => {
  const [setState] = useCaledarDateStore((state) => [state.setState]);
  const {
    state: { titleText },
    actions: { titleInputChangeHandler, createEvent },
  } = useSchedulePopup();

  return (
    <Animated.ScrollView
      entering={SlideInDown.duration(300)}
      exiting={SlideOutDown.duration(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => setState('isPopupOpen', false)}>
          <ExitIcon />
        </Pressable>
        <Text style={styles.headerTitle}>일정 등록</Text>
        <Pressable>
          <CheckIcon onPress={createEvent} />
        </Pressable>
      </View>
      <TextInput
        value={titleText}
        onChangeText={titleInputChangeHandler}
        style={styles.title}
        placeholder="제목"
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
      <TextInput />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    height: 500,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 11,
    shadowColor: '#19181b',
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    margin: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
  title: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: COLOR.bg,
    borderWidth: 0.5,
    borderColor: COLOR.sub5,
    borderRadius: 5,
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

export default SchedulePopup;
