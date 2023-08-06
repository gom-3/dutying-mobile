import BackDrop from '@components/BackDrop';
import SettingIcon from '@assets/svgs/setting.svg';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import ProfileIcon from '@assets/svgs/profile.svg';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { COLOR, screenHeight, screenWidth } from 'index.style';
import ExitIcon from '@assets/svgs/exit.svg';
import useSideMenu from './index.hook';

const SideMenu = () => {
  const {
    state: { menuItemList },
    actions: { closeSideMenu },
  } = useSideMenu();

  return (
    <>
      <BackDrop clickHandler={closeSideMenu} />
      <Animated.View
        style={styles.sideMenuContainer}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutRight.duration(300)}
      >
        <Pressable onPress={closeSideMenu}>
          <ExitIcon style={styles.exitIcon} />
        </Pressable>
        <View style={styles.profileView}>
          <View style={{ flexDirection: 'row' }}>
            <ProfileIcon />
            <Text style={styles.profileText}>조성연</Text>
          </View>
          <SettingIcon />
        </View>
        <View style={styles.deviderView} />
        {menuItemList.map((item) => (
          <Pressable key={item.title} onPress={item.onPress}>
            <View style={styles.menuItemView}>
              <item.icon />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
          </Pressable>
        ))}
        <View style={styles.logoutView}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sideMenuContainer: {
    position: 'absolute',
    zIndex: 4,
    backgroundColor: 'white',
    right: 0,
    width: screenWidth * 0.8,
    maxWidth: 310,
    height: screenHeight,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#19181b',
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.4,
    elevation: 8,
  },
  exitIcon: {
    marginTop: 66,
    marginLeft: 22,
  },
  profileView: {
    marginTop: 32,
    flexDirection: 'row',
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  profileText: {
    fontFamily: 'Apple',
    fontSize: 24,
    marginLeft: 12,
    color: COLOR.sub1,
  },
  deviderView: {
    marginTop: 24,
    width: '100%',
    height: 3,
    backgroundColor: '#f2f2f7',
  },
  menuItemView: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderBottomColor: '#d6d6de',
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontFamily: 'Apple',
    fontSize: 16,
    color: COLOR.sub2,
    marginLeft: 18,
  },
  logoutView: {
    position: 'absolute',
    left: 25,
    bottom: 41,
  },
  logoutText: {
    fontSize: 12,
    fontFamily: 'Apple',
    color: COLOR.sub25,
  },
});

export default SideMenu;
