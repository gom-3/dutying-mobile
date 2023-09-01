import { Pressable, View, StyleSheet, Text, StyleProp, ViewStyle, Platform } from 'react-native';
import UnderArrowIcon from '@assets/svgs/under-arrow.svg';
import useMonthSelector from './index.hook';
import { COLOR } from 'index.style';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface Props {
  isYearVisible?: boolean;
  style?: StyleProp<ViewStyle>;
}

const MonthSelector = ({ isYearVisible, style }: Props) => {
  const {
    states: { date, ref },
    actions: { onChangeDate, onPressMonthSelector },
  } = useMonthSelector();
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  return (
    <View style={style}>
      <Pressable onPress={onPressMonthSelector}>
        <View style={styles.datePresenterView}>
          <Text style={styles.datePresenterText}>
            {isYearVisible
              ? `${date.getFullYear()}년 ${date.getMonth() + 1}월`
              : `${date.getMonth() + 1}월`}
          </Text>
          <UnderArrowIcon />
        </View>
      </Pressable>
      {Platform.OS === 'ios' && (
        <BottomSheetModal
          ref={ref}
          index={1}
          snapPoints={[100, 300]}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          onChange={(index) => {
            if (index !== 1) ref.current?.close();
          }}
        >
          <DateTimePicker mode="date" display="spinner" value={date} onChange={onChangeDate} />
        </BottomSheetModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datePresenterView: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePresenterText: {
    fontFamily: 'Poppins',
    color: COLOR.main1,
    fontSize: 20,
    textDecorationLine: 'underline',
    textDecorationColor: COLOR.main1,
    marginRight: 5,
  },
  outSidePressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    zIndex: 100,
    width: 125,
  },
  dateSelectorView: {
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    borderRadius: 5,
    elevation: 5,
    shadowColor: Platform.OS === 'ios' ? 'rgba(210, 199, 231, 1)' : 'black',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    height: 240,
  },
  yearScrollView: {
    width: 76,
    height: 240,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  dateView: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#e7e7ef',
    borderBottomWidth: 0.5,
  },
  dateText: {
    fontFamily: 'Poppins500',
    fontSize: 16,
  },
  monthScrollView: {
    width: 47,
    height: 240,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default MonthSelector;
