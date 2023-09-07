import { COLOR } from 'index.style';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import ClockIcon from '@assets/svgs/clock.svg';
import useTimeHook from './index.hook';
import OutsidePressHandler from 'react-native-outside-press';
import DatePicker from '@components/DatePicker';

const Time = () => {
  const {
    states: { using, isOpen, mode, startDate, endDate, value },
    actions: { setUsing, setIsOpen, datePressHander, onChangeStartTime, onChangeEndTime },
  } = useTimeHook();

  return (
    <>
      <OutsidePressHandler disabled={false} onOutsidePress={() => setIsOpen(false)}>
        <View style={styles.item}>
          <View style={styles.itemTitleWrapper}>
            <ClockIcon />
            <Text style={styles.itemTitle}>시간 설정</Text>
          </View>
          <Switch
            trackColor={{ true: COLOR.main1 }}
            thumbColor="white"
            value={using}
            onValueChange={(value) => setUsing(value)}
          />
        </View>
        {using && (
          <View style={styles.usingView}>
            <View style={styles.itemTitleWrapper}>
              <DatePicker mode="date" date={startDate} text="시작일" onChange={onChangeStartTime} />
              <DatePicker
                style={{ marginLeft: 16 }}
                mode="date"
                date={endDate}
                text="종료일"
                onChange={onChangeEndTime}
              />
            </View>
            <View style={[styles.itemTitleWrapper, { marginTop: 18 }]}>
              <DatePicker
                mode="datetime"
                date={startDate}
                text="시작 시간"
                onChange={onChangeStartTime}
              />
              <DatePicker
                mode="datetime"
                date={endDate}
                text="종료 시간"
                onChange={onChangeEndTime}
                style={{ marginLeft: 30 }}
              />
            </View>
          </View>
        )}
      </OutsidePressHandler>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
  usingView: { marginHorizontal: 24, marginVertical: 0 },
  usingItemTitle: { fontFamily: 'Apple', fontSize: 10, color: COLOR.sub3 },
  usingItemWrapper: { flexDirection: 'row' },
  usingItemText: {
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    color: COLOR.sub1,
    paddingVertical: 4,
  },
});

export default Time;
