import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import PlusIcon from '@assets/svgs/plus.svg';
import PencilIcon from '@assets/svgs/pencil.svg';
import useShiftTypePage from './index.hook';
import { COLOR } from 'index.style';

const ShiftTypePage = () => {
  const {
    states: { workShiftTypes, offShiftTypes },
    actions: { onPressPlusIcon, onPressEditIcon },
  } = useShiftTypePage();
  return (
    <PageViewContainer>
      <SafeAreaView>
        <PageHeader
          title="근무 유형"
          rightItems={
            <Pressable onPress={onPressPlusIcon}>
              <PlusIcon />
            </Pressable>
          }
        />
        <View style={styles.category}>
          <Text style={styles.categoryText}>근무</Text>
        </View>
        {workShiftTypes.map((shiftType) => (
          <View style={styles.shift} key={shiftType.accountShiftTypeId}>
            <View style={[styles.shiftBox, { backgroundColor: shiftType.color }]}>
              <Text style={styles.shoftName}>{shiftType.shortName}</Text>
              <Text style={styles.name}>{shiftType.name}</Text>
            </View>
            {shiftType.startTime && shiftType.endTime ? (
              <Text style={styles.time}>{`${shiftType.startTime.getHours()}:${shiftType.startTime
                .getMinutes()
                .toString()
                .padStart(2, '0')}-${shiftType.endTime.getHours()}:${shiftType.endTime
                .getMinutes()
                .toString()
                .padStart(2, '0')}`}</Text>
            ) : (
              <Text style={styles.time}>-</Text>
            )}
            <Pressable onPress={() => onPressEditIcon(shiftType)}>
              <PencilIcon />
            </Pressable>
          </View>
        ))}
        <View style={styles.category}>
          <Text style={styles.categoryText}>오프</Text>
        </View>
        {offShiftTypes.map((shiftType) => (
          <View style={styles.shift} key={shiftType.accountShiftTypeId}>
            <View style={[styles.shiftBox, { backgroundColor: shiftType.color }]}>
              <Text style={styles.shoftName}>{shiftType.shortName}</Text>
              <Text style={styles.name}>{shiftType.name}</Text>
            </View>
            <Text style={styles.time}>-</Text>
            <Pressable onPress={() => onPressEditIcon(shiftType)}>
              <PencilIcon />
            </Pressable>
          </View>
        ))}
      </SafeAreaView>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  category: {
    marginTop: 42,
    paddingHorizontal: 24,
    paddingBottom: 10,
    borderBottomColor: '#d6d6de',
    borderBottomWidth: 0.5,
  },
  categoryText: {
    color: COLOR.sub3,
    fontFamily: 'Apple',
    fontSize: 16,
  },
  shift: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomColor: '#d6d6de',
    borderBottomWidth: 0.5,
  },
  shiftBox: {
    flexDirection: 'row',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 3,
    borderRadius: 7,
    marginRight: 24,
  },
  shoftName: {
    fontSize: 20,
    height: 28,
    marginRight: 4,
    fontFamily: 'Poppins500',
    color: 'white',
  },
  name: {
    fontFamily: 'Apple',
    fontSize: 14,
    color: 'white',
  },
  time: {
    flex: 1,
    color: COLOR.sub1,
    fontFamily: 'Poppins',
    fontSize: 16,
  },
});

export default ShiftTypePage;
