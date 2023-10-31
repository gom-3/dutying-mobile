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
    states: {
      shift,
      usingTime,
      isEdit,
      workTypeList,
      offTypeList,
      isWorkTypeShift,
      isValid,
      isDefaultShiftType,
    },
    actions: {
      setIsValid,
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
              titleMargin={isEdit && !isDefaultShiftType ? 38 : 0}
              rightItems={
                <View style={styles.headerIcons}>
                  {isEdit && !isDefaultShiftType && (
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
                  onChangeText={(e) => {
                    onChangeTextInput('name', e);
                    setIsValid((prev) => ({ ...prev, name: true }));
                  }}
                  style={[
                    styles.nameInput,
                    { borderColor: isValid.name ? COLOR.main4 : COLOR.invalidBorder },
                  ]}
                />
                <TextInputBox
                  placeholder="D"
                  value={shift.shortName}
                  maxLength={2}
                  onChangeText={(e) => {
                    onChangeTextInput('shortName', e);
                    setIsValid((prev) => ({ ...prev, shortName: true }));
                  }}
                  style={[
                    styles.shortNameInput,
                    { borderColor: isValid.shortName ? COLOR.main4 : COLOR.invalidBorder },
                  ]}
                />
              </View>
              {(!isValid.name || !isValid.shortName) && (
                <Text
                  style={{
                    position: 'absolute',
                    fontSize: 12,
                    bottom: 20,
                    left: 30,
                    fontFamily: 'Apple',
                    color: COLOR.invalidText,
                  }}
                >
                  근무 이름을 확인해주세요.
                </Text>
              )}
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <TypeIcon />
                <Text style={styles.itemHeaderText}>유형</Text>
              </View>
              {isDefaultShiftType && (
                <View
                  style={{
                    width: 60,
                    marginTop: 20,
                    padding: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: COLOR.main1,
                    backgroundColor: COLOR.main4,
                  }}
                >
                  <Text style={{ fontFamily: 'Apple500', fontSize: 16, color: COLOR.main1 }}>
                    {
                      workTypeList
                        .concat(offTypeList)
                        .find((type) => type.key === shift.classification)?.text
                    }
                  </Text>
                </View>
              )}
              {!isDefaultShiftType && (
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Pressable
                    onPress={() => onPressShiftType('OTHER_WORK')}
                    style={{
                      padding: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderWidth: 0.5,
                      backgroundColor:
                        shift.classification === 'OTHER_WORK' ? COLOR.main4 : COLOR.sub5,
                      borderColor: shift.classification === 'OTHER_WORK' ? COLOR.main1 : COLOR.sub4,
                    }}
                  >
                    <Text
                      style={{
                        color: shift.classification === 'OTHER_WORK' ? COLOR.main1 : COLOR.sub25,
                        fontFamily: 'Apple500',
                        fontSize: 16,
                      }}
                    >
                      근무
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onPressShiftType('OTHER_LEAVE')}
                    style={{
                      padding: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                      borderWidth: 0.5,
                      backgroundColor:
                        shift.classification === 'OTHER_LEAVE' ? COLOR.main4 : COLOR.sub5,
                      borderColor:
                        shift.classification === 'OTHER_LEAVE' ? COLOR.main1 : COLOR.sub4,
                    }}
                  >
                    <Text style={{ color: COLOR.sub25, fontFamily: 'Apple500', fontSize: 16 }}>
                      오프
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
            {isWorkTypeShift && (
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
            )}
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
