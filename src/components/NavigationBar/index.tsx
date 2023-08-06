import SelectedLogoIcon from '@assets/svgs/logo-selected.svg';
import LogoIcon from '@assets/svgs/logo.svg';
import GroupIcon from '@assets/svgs/group.svg';
import WardIcon from '@assets/svgs/ward.svg';
import { Platform, View, Text } from 'react-native';
import { COLOR, screenWidth } from 'index.style';
import { Shadow } from 'react-native-shadow-2';

const NavigationBar = () => {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 4,
        bottom: 0,
      }}
    >
      <Shadow distance={50} startColor="#c9bfde" offset={[0, 35]} containerStyle={{ height: 100 }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            width: screenWidth,
            backgroundColor: 'white',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, marginBottom: 34, alignItems: 'center' }}>
            <GroupIcon />
            <Text style={{ fontFamily: 'Apple', fontSize: 12, color: COLOR.sub3 }}>그룹</Text>
          </View>
          <SelectedLogoIcon
            style={{
              position: 'absolute',
              left: '50%',
              transform: [{ translateX: -44 }, { translateY: -30 }],
            }}
          />
          <View style={{ flex: 1, marginBottom: 34, alignItems: 'center' }}>
            <WardIcon />
            <Text style={{ fontFamily: 'Apple', fontSize: 12, color: COLOR.sub3 }}>병동</Text>
          </View>
        </View>
      </Shadow>
    </View>
  );
};

export default NavigationBar;
