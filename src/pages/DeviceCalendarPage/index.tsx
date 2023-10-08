import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDeviceCalendarPage from './index.hook';
import PageHeader from '@components/PageHeader';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import PencilIcon from '@assets/svgs/pencil.svg';
import CheckButtonChecked from '@assets/svgs/check-button-checked.svg';
import CheckButton from '@assets/svgs/check-button.svg';
import CheckIcon from '@assets/svgs/check.svg';
import TrashIcon from '@assets/svgs/trash.svg';
import { COLOR } from 'index.style';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import BottomSheetHeader from '@components/BottomSheetHeader';
import ColorPicker from '@components/ColorPicker';

const DeviceCalendarPage = () => {
  const {
    states: { isEdit, name, color, ref, normalCalendars, dutyingCalendars, calendarLink },
    actions: {
      pressLinkHandler,
      changeTextHandler,
      openModalCreateMode,
      openModalEditMode,
      setColor,
      createCalendar,
      deleteCalendar,
    },
  } = useDeviceCalendarPage();

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader title="캘린더 연동" />
          <View style={styles.header}>
            <Text style={styles.headerName}>듀팅 캘린더</Text>
            <Pressable onPress={openModalCreateMode}>
              <Text style={styles.add}>추가하기</Text>
            </Pressable>
          </View>
          <ScrollView>
            {dutyingCalendars.map((calendar) => (
              <View style={styles.item} key={calendar.id}>
                <View style={styles.itemLeft}>
                  <Pressable onPress={() => pressLinkHandler(calendar.id)}>
                    {calendarLink[calendar.id] ? <CheckButtonChecked /> : <CheckButton />}
                  </Pressable>
                  <View style={[{ backgroundColor: calendar.color }, styles.color]} />
                  <Text style={styles.itemText}>{calendar.title.slice(3)}</Text>
                </View>
                <Pressable onPress={() => openModalEditMode(calendar)}>
                  <PencilIcon />
                </Pressable>
              </View>
            ))}
            <View style={styles.header}>
              <Text style={styles.headerName}>기기 캘린더</Text>
            </View>
            {normalCalendars.map((calendar) => (
              <View style={styles.item} key={calendar.id}>
                <View style={styles.itemLeft}>
                  <Pressable onPress={() => pressLinkHandler(calendar.id)}>
                    {calendarLink[calendar.id] ? <CheckButtonChecked /> : <CheckButton />}
                  </Pressable>
                  <View style={[{ backgroundColor: calendar.color }, styles.color]} />
                  <Text style={styles.itemText}>{calendar.title}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <BottomSheetModal
            style={{ padding: 14 }}
            ref={ref}
            index={1}
            enableContentPanningGesture={false}
            snapPoints={[100, 400]}
            handleComponent={null}
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
            onChange={(index) => {
              if (index !== 1) ref.current?.close();
            }}
          >
            <BottomSheetHeader
              title={isEdit ? '편집' : '추가'}
              titleMargin={isEdit ? 38 : 0}
              rightItems={
                <View style={{ flexDirection: 'row' }}>
                  {isEdit && (
                    <Pressable style={{ marginRight: 14 }} onPress={deleteCalendar}>
                      <TrashIcon />
                    </Pressable>
                  )}
                  <Pressable onPress={createCalendar}>
                    <CheckIcon />
                  </Pressable>
                </View>
              }
              onPressExit={() => {}}
            />
            <View style={{ padding: 10 }}>
              <BottomSheetTextInput
                maxLength={10}
                onChangeText={changeTextHandler}
                style={styles.input}
                value={name}
                placeholder="유형 이름"
              />
              <Text style={styles.inputGuideText}>캘린더에 표시되는 일정을 분류해보세요.</Text>
              <Text style={styles.modalColorText}>색상</Text>
              <ColorPicker
                color={color.length > 0 ? color : 'white'}
                onChange={(color) => setColor(color)}
              />
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR.main4,
    width: '100%',
    fontSize: 20,
    fontFamily: 'Apple',
    color: COLOR.sub1,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  color: {
    width: 24,
    height: 24,
    marginHorizontal: 16,
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 20,
  },
  headerName: {
    fontFamily: 'Apple',
    fontSize: 13,
    color: COLOR.sub3,
  },
  add: {
    color: COLOR.main2,
    fontSize: 13,
    fontFamily: 'Apple500',
    textDecorationColor: COLOR.main2,
    textDecorationLine: 'underline',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: 'Apple',
    color: COLOR.sub2,
    fontSize: 16,
  },
  inputGuideText: {
    color: COLOR.sub3,
    fontSize: 12,
    fontFamily: 'Apple',
    marginTop: 10,
  },
  modalColorText: {
    color: COLOR.sub3,
    fontSize: 16,
    fontFamily: 'Apple',
    marginTop: 42,
  },
  modalColor: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLOR.sub4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeviceCalendarPage;
