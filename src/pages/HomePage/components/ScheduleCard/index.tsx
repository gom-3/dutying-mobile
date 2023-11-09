import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLOR, screenHeight, screenWidth } from 'index.style';
import PencilIcon from '@assets/svgs/pencil.svg';
import AddButtonIcon from '@assets/svgs/add-button.svg';
import AddShiftIcon from '@assets/svgs/add-shift.svg';
import BackDrop from '@components/BackDrop';
import useScheduleCard from './index.hook';
import Carousel from 'react-native-reanimated-carousel';
import { DateType } from '../Calendar';

interface Props {
  isCardOpen: boolean;
}

const days = ['일', '월', '화', '수', '목', '금', '토'];

const ScheduleCard = ({ isCardOpen }: Props) => {
  const {
    state: { carouselRef, thisMonthCalendar, thisMonthDefaultIndex, shiftTypes },
    actions: {
      backDropPressHandler,
      addSchedulePressHandler,
      editSchedulePressHandler,
      editShiftPressHandler,
      changeDate,
    },
  } = useScheduleCard(isCardOpen);
  const renderItem = ({ item }: { item: DateType }) => {
    const shift = shiftTypes.get(item.shift || 0);
    return (
      <View style={styles.cardView}>
        <Text style={styles.dateText}>
          {item.date.getMonth() + 1}월 {item.date.getDate()}일 {days[item.date.getDay()]}
        </Text>
        <View style={styles.cardHeaderView}>
          {item?.shift ? (
            <View style={styles.shiftWrapperView}>
              <View style={[styles.shiftBoxView, { backgroundColor: shift?.color }]}>
                <Text style={styles.shiftBoxText}>{shift?.shortName}</Text>
              </View>
              <Text style={styles.shiftNameText}>{shift?.name}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={editShiftPressHandler}>
              <View style={styles.shiftWrapperView}>
                <AddShiftIcon />
                <Text style={styles.registShiftText}>근무를 등록해주세요.</Text>
              </View>
            </TouchableOpacity>
          )}
          {item?.shift && (
            <Pressable onPress={editShiftPressHandler}>
              <PencilIcon />
            </Pressable>
          )}
        </View>
        <ScrollView
          nestedScrollEnabled
          style={{
            padding: 24,
            backgroundColor: 'white',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          {item?.schedules.map((schedule) => (
            <TouchableOpacity
              activeOpacity={schedule.editbale ? 0.2 : 1}
              key={schedule.id}
              onPress={() => editSchedulePressHandler(schedule)}
            >
              <View key={schedule.title} style={styles.scheduleView}>
                <View
                  style={[
                    styles.scheduleColorView,
                    {
                      backgroundColor: schedule.color,
                    },
                  ]}
                />
                <View>
                  <Text style={styles.scheduleNameText}>{schedule.title}</Text>
                  <Text style={styles.scheduleDateText}>
                    {schedule.allDay
                      ? '하루 종일'
                      : schedule.startTime.getHours().toString().padStart(2, '0') +
                        ':' +
                        schedule.startTime.getMinutes().toString().padStart(2, '0') +
                        ' - ' +
                        schedule.endTime.getHours().toString().padStart(2, '0') +
                        ':' +
                        schedule.endTime.getMinutes().toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.4}
          style={styles.addButtonIcon}
          onPress={addSchedulePressHandler}
        >
          <AddButtonIcon width={50} height={50} />
        </TouchableOpacity>
      </View>
    );
  };

  if (!isCardOpen) return;

  return (
    <View
      style={{
        position: 'absolute',
        width: screenWidth,
        height: screenHeight,
      }}
    >
      <BackDrop clickHandler={backDropPressHandler} />
        <Animated.View entering={FadeInDown.duration(250)} style={styles.scheduleCardContainer}>
        <Carousel
          panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
          loop={false}
          ref={carouselRef}
          data={thisMonthCalendar}
          renderItem={renderItem}
          width={screenWidth}
          mode="parallax"
          height={500}
          onScrollEnd={changeDate}
          defaultIndex={thisMonthDefaultIndex}
          windowSize={3}
        />
        {/* <FlatList
          scrollEnabled
          horizontal
          ref={carouselRef}
          style={styles.scheduleCardContainer}
          data={calendar}
          renderItem={renderItem}
          windowSize={3}
        /> */}
        {/* <ScrollView>
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
          <View style={styles.cardView} />
        </ScrollView> */}
        </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleCardContainer: {
    width: screenWidth,
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 10,
    top: '20%',
  },
  cardView: {
    width: screenWidth,
    height: 550,
    backgroundColor: 'white',
    margin: screenWidth * 0.02,
    borderRadius: 20,
    shadowColor: '#19181b',
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 20,
    elevation: 3,
  },
  dateText: {
    position: 'absolute',
    top: -40,
    color: 'white',
    fontFamily: 'Apple',
    fontSize: 24,
  },
  todayText: {
    position: 'absolute',
    top: -57,
    fontSize: 12,
    fontFamily: 'Apple',
    color: 'white',
  },
  cardHeaderView: {
    width: '100%',
    height: 64,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#f2f2f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shiftWrapperView: { flexDirection: 'row', alignItems: 'center' },
  shiftBoxView: {
    width: 24,
    height: 24,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shiftBoxText: {
    fontSize: 16,
    height: 22,
    fontFamily: 'Poppins',
    color: 'white',
  },
  shiftNameText: { marginLeft: 20, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub1 },
  registShiftText: {
    fontSize: 16,
    marginLeft: 20,
    fontFamily: 'Apple',
    color: COLOR.sub25,
  },
  scheduleView: { flexDirection: 'row', marginBottom: 24 },
  scheduleColorView: { width: 24, height: 24, borderRadius: 5, marginRight: 20 },
  scheduleNameText: { fontFamily: 'Apple', fontSize: 16, color: COLOR.sub1 },
  scheduleDateText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: COLOR.sub3,
    marginTop: 8,
  },
  addButtonIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
});

export default ScheduleCard;
