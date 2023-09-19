import { View, StyleSheet, Text, StyleProp, ViewStyle, Platform, TouchableOpacity } from 'react-native';
import UnderArrowIcon from '@assets/svgs/under-arrow.svg';
import useMonthSelector from './index.hook';
import { COLOR } from 'index.style';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheetHeader from '@components/BottomSheetHeader';

interface Props {
  isImage?: boolean;
  style?: StyleProp<ViewStyle>;
}

const MonthSelector = ({ isImage, style }: Props) => {
  const {
    states: { date, ref },
    actions: { onChangeDate, onPressMonthSelector },
  } = useMonthSelector();
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  return (
    <View style={style}>
      <TouchableOpacity onPress={onPressMonthSelector}>
        <View style={styles.datePresenterView}>
          <Text style={styles.datePresenterText}>
            <Text style={{ fontFamily: 'Poppins600' }}>
              {(date.getMonth() + 1).toString().padStart(2, '0')}
            </Text>
            월
          </Text>
          {!isImage && <UnderArrowIcon />}
        </View>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <BottomSheetModal
          style={{ padding: 14 }}
          ref={ref}
          index={1}
          snapPoints={[100, 300]}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          onChange={(index) => {
            if (index !== 1) ref.current?.close();
          }}
        >
          <BottomSheetHeader
            style={{ marginBottom: 0 }}
            onPressExit={() => ref.current?.close()}
          />
          <DateTimePicker
            maximumDate={new Date(2025, 0, 1)}
            minimumDate={new Date(2020, 0, 1)}
            mode="date"
            display="spinner"
            value={date}
            onChange={onChangeDate}
          />
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
    fontFamily: 'Poppins500',
    color: COLOR.main1,
    fontSize: 20,
    textDecorationLine: 'underline',
    textDecorationColor: COLOR.main1,
    marginRight: 5,
  },
});

export default MonthSelector;
