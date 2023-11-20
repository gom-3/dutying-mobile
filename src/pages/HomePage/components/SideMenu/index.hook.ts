import { useLinkProps } from '@react-navigation/native';
import { SvgProps } from 'react-native-svg';
import { useCaledarDateStore } from 'store/calendar';
import PlusIcon from '@assets/svgs/plus-box.svg';
import EditShiftTypeIcon from '@assets/svgs/edit-shift-type.svg';
import ShareIcon from '@assets/svgs/share.svg';
import SliderIcon from '@assets/svgs/slider.svg';
import { useEffect, useMemo } from 'react';
import { useAccountStore } from 'store/account';
import { Alert, Platform } from 'react-native';
import { firebaseLogEvent } from '@libs/utils/event';
import * as NavigationBar from 'expo-navigation-bar';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';

interface SideMenuItem {
  icon: React.FC<SvgProps>;
  title: string;
  onPress: () => void;
}

const useSideMenu = () => {
  const [account, logoutAccount] = useAccountStore((state) => [state.account, state.logout]);
  const [setState] = useCaledarDateStore((state) => [state.setState]);
  const { onPress: onPressLinkRegistDuty } = useLinkProps({ to: { screen: 'RegistDuty' } });
  const { onPress: onPressEditShiftType } = useLinkProps({ to: { screen: 'ShiftType' } });
  const { onPress: onPressShare } = useLinkProps({ to: { screen: 'Share' } });
  const { onPress: onPressDeviceCalendar } = useLinkProps({ to: { screen: 'DeviceCalendar' } });
  const { onPress: navigateToMyPage } = useLinkProps({ to: { screen: 'MyPage' } });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  const closeSideMenu = () => {
    setState('isSideMenuOpen', false);
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(account.code);
    Toast.show({
      type: 'success',
      text1: '코드가 복사되었어요!',
      text2: '코드를 통해 친구를 맺을 수 있어요👋',
      visibilityTime: 2000,
    });
  };

  const menuItemList: SideMenuItem[] = useMemo(
    () => [
      {
        icon: PlusIcon,
        title: '근무 등록',
        onPress: () => {
          if (account.wardId > 0 && account.shiftTeamId > 0) {
            Alert.alert('병동과 연동된 계정은 따로 근무 등록을 할 수 없습니다.');
            return;
          }
          firebaseLogEvent('move_regist_duty');
          onPressLinkRegistDuty();
        },
      },
      {
        icon: EditShiftTypeIcon,
        title: '근무 유형 수정',
        onPress: () => {
          firebaseLogEvent('move_edit_shfit_type');
          onPressEditShiftType();
        },
      },
      {
        icon: ShareIcon,
        title: '공유하기',
        onPress: () => {
          firebaseLogEvent('move_share');
          onPressShare();
        },
      },
      {
        icon: SliderIcon,
        title: '캘린더 관리',
        onPress: () => {
          firebaseLogEvent('move_calendar_link');
          onPressDeviceCalendar();
        },
      },
      {
        icon: EditShiftTypeIcon,
        title: '이벤트',
        onPress: () => {
          firebaseLogEvent('link_event');
          // firebaseLogEvent('link_evaluate_duty_page');
          Linking.openURL('https://www.instagram.com/dutying_official');
        },
      },
    ],
    [],
  );
  return {
    state: { account, menuItemList },
    actions: { closeSideMenu, navigateToMyPage, copyCode },
  };
};

export default useSideMenu;
