import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '@assets/svgs/check.svg';
import TrashIcon from '@assets/svgs/trash.svg';
import ColorIcon from '@assets/svgs/color.svg';
import TimeIcon from '@assets/svgs/clock.svg';
import TypeIcon from '@assets/svgs/type.svg';
import WriteIcon from '@assets/svgs/write.svg';
import { Pressable, StyleSheet, View, Text, Switch } from 'react-native';
import { COLOR } from 'index.style';
import TextInputBox from '@components/TextInputBox';
import DatePicker from '@components/DatePicker';
import useShiftTypeEdit from './index.hook';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ColorPicker from '@components/ColorPicker';
import KeyboardAvoidWrapper from '@components/KeyboardAvoidWrapper';

const ShiftTypeEditPage = () => {
  const {
    states: { shift, usingTime, isEdit, workTypeList, offTypeList },
    actions: {
      onChangeSwith,
      changeStartTime,
      changeEndTime,
      onChangeColor,
      onChangeTextInput,
      onPressShiftType,
      onPressSaveButton,
      onPressDeleteButton,
    },
  } = useShiftTypeEdit();

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <KeyboardAvoidWrapper>
            <PageHeader
              title={isEdit ? '근무 유형 수정' : '근무 유형 등록'}
              titleMargin={isEdit ? 38 : 0}
              rightItems={
                <View style={styles.headerIcons}>
                  {isEdit && (
                    <Pressable style={styles.trashIcon} onPress={onPressDeleteButton}>
                      <TrashIcon />
                    </Pressable>
                  )}
                  <Pressable onPress={onPressSaveButton}>
                    <CheckIcon />
                  </Pressable>
                </View>
              }
            />
            <View style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <WriteIcon />
                <Text style={styles.itemHeaderText}>근무명•약자</Text>
              </View>
              <View style={styles.input}>
                <TextInputBox
                  autoFocus={!isEdit}
                  placeholder="데이"
                  value={shift.name}
                  maxLength={8}
                  onChangeText={(e) => onChangeTextInput('name', e)}
                  style={styles.nameInput}
                />
                <TextInputBox
                  placeholder="D"
                  value={shift.shortName}
                  maxLength={2}
                  onChangeText={(e) => onChangeTextInput('shortName', e)}
                  style={styles.shortNameInput}
                />
              </View>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <TypeIcon />
                <Text style={styles.itemHeaderText}>유형</Text>
              </View>
              <Text style={styles.shiftTypeHeader}>근무</Text>
              <View style={styles.shiftTypes}>
                {workTypeList.map((type) => {
                  const isSelected = shift.classification === type.key;
                  return (
                    <Pressable key={type.text} onPress={() => onPressShiftType(type.key)}>
                      <Text
                        style={[
                          styles.shiftTypeItem,
                          {
                            backgroundColor: isSelected ? COLOR.main4 : 'white',
                            borderColor: isSelected ? COLOR.main1 : COLOR.sub4,
                            color: isSelected ? COLOR.main1 : COLOR.sub25,
                          },
                        ]}
                      >
                        {type.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.shiftTypeHeader}>오프</Text>
              <View style={styles.shiftTypes}>
                {offTypeList.map((type) => {
                  const isSelected = shift.classification === type.key;
                  return (
                    <Pressable key={type.text} onPress={() => onPressShiftType(type.key)}>
                      <Text
                        style={[
                          styles.shiftTypeItem,
                          {
                            backgroundColor: isSelected ? COLOR.main4 : 'white',
                            borderColor: isSelected ? COLOR.main1 : COLOR.sub4,
                            color: isSelected ? COLOR.main1 : COLOR.sub25,
                          },
                        ]}
                      >
                        {type.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.itemTimeHeader}>
                <View style={{ flexDirection: 'row' }}>
                  <TimeIcon />
                  <Text style={styles.itemHeaderText}>근무 시간</Text>
                </View>
                <Switch
                  trackColor={{ true: COLOR.main1 }}
                  thumbColor="white"
                  value={usingTime}
                  onValueChange={onChangeSwith}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                {shift.startTime && (
                  <DatePicker
                    style={{ marginRight: 11 }}
                    mode="time"
                    date={shift.startTime}
                    onChange={changeStartTime}
                  />
                )}
                {shift.endTime && (
                  <DatePicker mode="time" date={shift.endTime} onChange={changeEndTime} />
                )}
              </View>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <ColorIcon />
                <Text style={styles.itemHeaderText}>색상</Text>
              </View>
              <ColorPicker color={shift.color} onChange={onChangeColor} />
            </View>
          </KeyboardAvoidWrapper>
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
  itemContainer: {
    paddingTop: 28,
    paddingBottom: 42,
    paddingHorizontal: 24,
    borderBottomColor: '#d6d6de',
    borderBottomWidth: 0.5,
  },
  itemHeader: {
    flexDirection: 'row',
  },
  itemHeaderText: {
    marginLeft: 8,
    fontFamily: 'Apple',
    color: COLOR.sub2,
    fontSize: 16,
  },
  itemTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    marginTop: 20,
  },
  nameInput: {
    width: 124,
  },
  shortNameInput: {
    marginLeft: 12,
    width: 60,
  },
  shiftTypes: {
    flexDirection: 'row',
    marginTop: 10,
  },
  shiftTypeHeader: {
    fontFamily: 'Apple',
    fontSize: 14,
    color: COLOR.sub3,
    marginTop: 20,
  },
  shiftTypeItem: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Apple',
    marginRight: 10,
  },
  color: {
    width: 54,
    height: 54,
    marginTop: 16,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 1,
  },
});

export default ShiftTypeEditPage;
