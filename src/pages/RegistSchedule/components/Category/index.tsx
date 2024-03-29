import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ArrowIcon from '@assets/svgs/under-arrow-black.svg';
import useCategory from './index.hook';
import { hexToRgba } from '@libs/utils/color';
import { COLOR } from 'index.style';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import BottomSheetHeader from '@components/BottomSheetHeader';
import PlusIcon from '@assets/svgs/plus.svg';
import { useNavigation } from '@react-navigation/native';

const Category = () => {
  const {
    states: { deviceCalendar, filteredDeviceCalendar, selectedCalendar, ref },
    actions: { openModal, pressCategoryHandler, navigateEditDeviceCalendar },
  } = useCategory();

  const navigate = useNavigation();

  if (deviceCalendar.length === 0) {
    Alert.alert('일정 추가가 가능한 캘린더가 없습니다.');
    navigate.goBack();
  }

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: COLOR.sub4,
        borderBottomWidth: 0.3,
        paddingVertical: 20,
      }}
    >
      <TouchableOpacity activeOpacity={0.5} onPress={openModal}>
        <View
          style={[
            styles.category,
            {
              backgroundColor: hexToRgba(selectedCalendar.color, 0.3),
              borderColor: selectedCalendar.color,
            },
          ]}
        >
          <Text style={styles.categoryText}>
            {selectedCalendar.title.startsWith('듀팅-')
              ? selectedCalendar.title.slice(3)
              : selectedCalendar.title}
          </Text>
          <ArrowIcon />
        </View>
      </TouchableOpacity>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        style={{ padding: 14 }}
        handleComponent={null}
        enableContentPanningGesture={false}
        index={1}
        snapPoints={[100, 300]}
        onChange={(index) => {
          if (index !== 1) ref.current?.close();
        }}
        ref={ref}
      >
        <BottomSheetHeader
          rightItems={
            <TouchableOpacity onPress={navigateEditDeviceCalendar}>
              <PlusIcon />
            </TouchableOpacity>
          }
          title="유형"
          onPressExit={() => ref.current?.close()}
        />
        <ScrollView>
          {filteredDeviceCalendar.map((calendar) => (
            <TouchableOpacity
              style={styles.item}
              key={calendar.id}
              onPress={() => pressCategoryHandler(calendar)}
            >
              <View
                style={[
                  styles.color,
                  {
                    backgroundColor: hexToRgba(calendar.color, 0.3),
                    borderColor: calendar.color,
                  },
                ]}
              />
              <Text
                style={[
                  styles.itemText,
                  {
                    color: selectedCalendar.id === calendar.id ? COLOR.main1 : COLOR.sub2,
                    fontFamily: selectedCalendar.id === calendar.id ? 'Apple600' : 'Apple',
                    textDecorationLine: selectedCalendar.id === calendar.id ? 'underline' : 'none',
                  },
                ]}
              >
                {calendar.title.startsWith('듀팅-') ? calendar.title.slice(3) : calendar.title}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  category: {
    paddingHorizontal: 13,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
  },
  categoryText: {
    fontFamily: 'Apple',
    fontSize: 14,
    color: COLOR.sub2,
    marginRight: 7,
  },
  color: {
    width: 24,
    height: 24,
    borderRadius: 3,
    borderWidth: 2,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 14,
  },
});

export default Category;
