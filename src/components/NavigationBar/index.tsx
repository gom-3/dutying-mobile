import SelectedLogoIcon from '@assets/svgs/logo-selected.svg';
import GroupIcon from '@assets/svgs/group.svg';
import WardIcon from '@assets/svgs/ward.svg';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR, screenWidth } from 'index.style';
import { Shadow } from 'react-native-shadow-2';

const NavigationBar = () => {
  return (
    <View style={styles.navigationContainer}>
      <Shadow distance={50} startColor="#c9bfde" offset={[0, 35]} containerStyle={{ height: 100 }}>
        <View style={styles.navigationView}>
          <View style={styles.itemView}>
            <GroupIcon />
            <Text style={styles.itemText}>그룹</Text>
          </View>
          <SelectedLogoIcon style={styles.logoIcon} />
          <View style={styles.itemView}>
            <WardIcon />
            <Text style={styles.itemText}>병동</Text>
          </View>
        </View>
      </Shadow>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    zIndex: 4,
    bottom: 0,
  },
  navigationView: {
    flexDirection: 'row',
    flex: 1,
    width: screenWidth,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  itemView: { flex: 1, marginBottom: 34, alignItems: 'center' },
  itemText: { fontFamily: 'Apple', fontSize: 12, color: COLOR.sub3 },
  logoIcon: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -44 }, { translateY: -30 }],
  },
});

export default NavigationBar;
