import { useLinkProps } from '@react-navigation/native';
import { SvgProps } from 'react-native-svg';
import { useCaledarDateStore } from 'store/calendar';
import PlusIcon from '@assets/svgs/plus-box.svg';
import EditShiftTypeIcon from '@assets/svgs/edit-shift-type.svg';
import ShareIcon from '@assets/svgs/share.svg';
import SliderIcon from '@assets/svgs/slider.svg';
import { useEffect, useMemo } from 'react';
import { useAccountStore } from 'store/account';
import { navigateToLoginAndResetHistory } from '@libs/utils/navigate';
import { Alert, Platform } from 'react-native';
import { firebaseLogEvent } from '@libs/utils/event';
import * as NavigationBar from 'expo-navigation-bar';
import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '@libs/api/account';

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
  const { mutate: deleteAccountMutate } = useMutation(() => deleteAccount(account.accountId), {
    onSuccess: () => {
      navigateToLoginAndResetHistory();
      setState('isSideMenuOpen', false);
      logoutAccount();
    },
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
    return () => {
      if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  const closeSideMenu = () => {
    setState('isSideMenuOpen', false);
  };

  const logout = () => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {
        text: '네',
        onPress: () => {
          navigateToLoginAndResetHistory();
          setState('isSideMenuOpen', false);
          logoutAccount();
        },
      },
      { text: '아니오', onPress: () => {} },
    ]);
  };

  const signout = () => {
    Alert.alert('정말 탈퇴하시겠습니까?', '', [
      {
        text: '네',
        onPress: () => {
          deleteAccountMutate();
        },
      },
      { text: '아니오', onPress: () => {} },
    ]);
  };

  const menuItemList: SideMenuItem[] = useMemo(
    () => [
      {
        icon: PlusIcon,
        title: '근무 등록',
        onPress: () => {
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
        title: '캘린더 연동',
        onPress: () => {
          firebaseLogEvent('move_calendar_link');
          onPressDeviceCalendar();
        },
      },
    ],
    [],
  );
  return {
    state: { account, menuItemList },
    actions: { closeSideMenu, logout, signout, navigateToMyPage },
  };
};

export default useSideMenu;
