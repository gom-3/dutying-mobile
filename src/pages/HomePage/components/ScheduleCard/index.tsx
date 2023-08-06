import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomInRotate, ZoomOutRotate } from 'react-native-reanimated';
import { COLOR, screenWidth } from 'index.style';
import { GestureDetector } from 'react-native-gesture-handler';
import PencilIcon from '@assets/svgs/pencil.svg';
import AddButtonIcon from '@assets/svgs/add-button.svg';
import AddShiftIcon from '@assets/svgs/add-shift.svg';
import BackDrop from '@components/BackDrop';
import useScheduleCard from './index.hook';

const days = ['일', '월', '화', '수', '목', '금', '토'];

const ScheduleCard = () => {
  const {
    state: { animatedStyles, panGesture, date, selectedDateData, shiftTypes, isToday },
    actions: { backDropPressHandler, addButtonPressHandler },
  } = useScheduleCard();

  return (
    <>
      <BackDrop clickHandler={backDropPressHandler} />
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[animatedStyles, styles.scheduleCardContainer]}
          entering={ZoomInRotate.duration(150)}
          exiting={ZoomOutRotate.duration(100)}
        >
          <View style={styles.cardView}>
            <View style={styles.cardHeaderView} />
          </View>
          <View style={styles.cardView}>
            <Text style={styles.dateText}>
              {date.getMonth() + 1}월 {date.getDate()}일 {days[date.getDay()]}
            </Text>
            {isToday && <Text style={styles.todayText}>오늘</Text>}
            <View style={styles.cardHeaderView}>
              {selectedDateData?.shift !== undefined ? (
                <View style={styles.shiftWrapperView}>
                  <View
                    style={[
                      styles.shiftBoxView,
                      { backgroundColor: shiftTypes[selectedDateData.shift].color },
                    ]}
                  >
                    <Text style={styles.shiftBoxText}>
                      {shiftTypes[selectedDateData.shift].shortName}
                    </Text>
                  </View>
                  <Text style={styles.shiftNameText}>
                    {shiftTypes[selectedDateData.shift].name}
                  </Text>
                </View>
              ) : (
                <View style={styles.shiftWrapperView}>
                  <AddShiftIcon />
                  <Text style={styles.registShiftText}>근무를 등록해주세요.</Text>
                </View>
              )}
              {selectedDateData?.shift !== undefined && <PencilIcon />}
            </View>
            <Pressable style={styles.addButtonIcon} onPress={addButtonPressHandler}>
              <AddButtonIcon />
            </Pressable>
          </View>
          <View style={styles.cardView}>
            <View style={styles.cardHeaderView} />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  scheduleCardContainer: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 10,
    // overflow: 'hidden',
    top: '25%',
    left: -screenWidth * 0.76,
  },
  cardView: {
    width: screenWidth * 0.8,
    height: 448,
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
  },
  shiftBoxText: {
    fontSize: 16,
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
  addButtonIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
});

export default ScheduleCard;
