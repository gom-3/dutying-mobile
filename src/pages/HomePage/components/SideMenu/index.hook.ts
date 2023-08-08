import { useLinkProps } from '@react-navigation/native';
import { GestureResponderEvent } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useCaledarDateStore } from 'store/calendar';
import EditShiftTypeIcon from '@assets/svgs/edit-shift-type.svg';
import DutyPhotoIcon from '@assets/svgs/duty-photo.svg';
import ShareIcon from '@assets/svgs/share.svg';
import DesignIcon from '@assets/svgs/design.svg';
import { useMemo } from 'react';

interface SideMenuItem {
  icon: React.FC<SvgProps>;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const useSideMenu = () => {
  const [setState] = useCaledarDateStore((state) => [state.setState]);
  const { onPress: onPressLinkRegistDuty } = useLinkProps({ to: { screen: 'Regist' } });

  const closeSideMenu = () => {
    setState('isSideMenuOpen', false);
  };

  const menuItemList: SideMenuItem[] = useMemo(
    () => [
      {
        icon: EditShiftTypeIcon,
        title: '근무 등록',
        onPress: onPressLinkRegistDuty,
      },
      {
        icon: EditShiftTypeIcon,
        title: '근무 유형 수정',
        onPress: onPressLinkRegistDuty,
      },
      {
        icon: DutyPhotoIcon,
        title: '근무표 사진 등록',
        onPress: onPressLinkRegistDuty,
      },
      {
        icon: ShareIcon,
        title: '공유하기',
        onPress: onPressLinkRegistDuty,
      },
      {
        icon: DesignIcon,
        title: '디자인 테마',
        onPress: onPressLinkRegistDuty,
      },
    ],
    [],
  );

  return { state: { menuItemList }, actions: { closeSideMenu } };
};

export default useSideMenu;
