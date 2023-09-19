import { useLinkProps } from '@react-navigation/native';
import { SvgProps } from 'react-native-svg';
import { useCaledarDateStore } from 'store/calendar';
import PlusIcon from '@assets/svgs/plus-box.svg';
import EditShiftTypeIcon from '@assets/svgs/edit-shift-type.svg';
import ShareIcon from '@assets/svgs/share.svg';
import SliderIcon from '@assets/svgs/slider.svg';
import { useMemo } from 'react';
import { useAccountStore } from 'store/account';
import analytics from '@react-native-firebase/analytics';

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
  const { onPress: onPressLogout } = useLinkProps({ to: { screen: 'Login' } });

  const closeSideMenu = () => {
    setState('isSideMenuOpen', false);
  };

  const logout = () => {
    logoutAccount();
    setState('isSideMenuOpen', false);
    onPressLogout();
  };

  const menuItemList: SideMenuItem[] = useMemo(
    () => [
      {
        icon: PlusIcon,
        title: '근무 등록',
        onPress: () => {
          analytics().logEvent('move_regist_duty');
          onPressLinkRegistDuty();
        },
      },
      {
        icon: EditShiftTypeIcon,
        title: '근무 유형 수정',
        onPress: () => {
          analytics().logEvent('move_edit_shfit_type');
          onPressEditShiftType();
        },
      },
      {
        icon: ShareIcon,
        title: '공유하기',
        onPress: () => {
          analytics().logEvent('move_share');
          onPressShare();
        },
      },
      {
        icon: SliderIcon,
        title: '캘린더 연동',
        onPress: () => {
          analytics().logEvent('move_calendar_link');
          onPressDeviceCalendar();
        },
      },
    ],
    [],
  );
  return { state: { account, menuItemList }, actions: { closeSideMenu, logout } };
};

export default useSideMenu;
