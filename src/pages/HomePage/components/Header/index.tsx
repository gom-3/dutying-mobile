import UnderArrowIcon from '@assets/svgs/under-arrow.svg';
import BellIcon from '@assets/svgs/bell.svg';
import BurgerIcon from '@assets/svgs/burger.svg';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import useCalendarHeader from './index.hook';
import { COLOR } from 'index.style';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  const {
    state: { date, shiftTypes, shiftTypesCount },
    actions: { setState, dateViewClickHander },
  } = useCalendarHeader();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.firstLevelView}>
        <Pressable onPress={dateViewClickHander}>
          <View style={styles.dateView}>
            <Text style={styles.dateText}>
              {date.getFullYear()}년 {date.getMonth() + 1}월
            </Text>
            <UnderArrowIcon />
          </View>
        </Pressable>
        <View style={styles.sideMenuView}>
          <View style={styles.bellView}>
            <BellIcon />
            <View style={styles.alertDotView} />
          </View>
          <Pressable onPress={() => setState('isSideMenuOpen', true)}>
            <BurgerIcon />
          </Pressable>
        </View>
      </View>
      <View style={styles.secondLevelView}>
        {shiftTypes.map((shift, i) => (
          <View key={shift.name} style={styles.shiftView}>
            <View style={[styles.shiftBoxView, { backgroundColor: shift.color }]}>
              <Text style={styles.shiftText}>{shift.shortName}</Text>
            </View>
            <Text style={styles.shiftCountText}>{shiftTypesCount[i]}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 15,
    backgroundColor: 'white',
    zIndex: 3,
  },
  firstLevelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateView: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideMenuView: {
    flexDirection: 'row',
  },
  dateText: {
    fontFamily: 'Poppins',
    color: COLOR.main1,
    fontSize: 20,
    textDecorationLine: 'underline',
    textDecorationColor: COLOR.main1,
    marginRight: 5,
  },
  bellView: {
    position: 'relative',
    width: 24,
    marginRight: 14,
  },
  alertDotView: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 100,
    backgroundColor: COLOR.main1,
  },
  secondLevelView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  shiftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    zIndex: 3,
  },
  shiftBoxView: {
    borderRadius: 2,
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: 'white',
  },
  shiftCountText: {
    fontSize: 12,
    color: COLOR.sub3,
    marginLeft: 4,
  },
});

export default Header;
