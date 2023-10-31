import SelectedLogoIcon from '@assets/svgs/logo-selected.svg';
import LogoIcon from '@assets/svgs/logo.svg';
import SocialIcon from '@assets/svgs/social.svg';
import SelectedSocialIcon from '@assets/svgs/social-selected.svg';
import WardIcon from '@assets/svgs/ward.svg';
import SelectedWardIcon from '@assets/svgs/ward-selected.svg';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLOR, screenWidth } from 'index.style';
import { useLinkProps } from '@react-navigation/native';

interface Props {
  page: 'home' | 'social' | 'ward';
}

const NavigationBar = ({ page }: Props) => {
  const { onPress: navigateToHome } = useLinkProps({ to: { screen: 'Home' } });
  const { onPress: navigateToSocial } = useLinkProps({ to: { screen: 'Moim' } });
  const { onPress: navigateToWard } = useLinkProps({ to: { screen: 'Ward' } });

  return (
    <View style={styles.navigationContainer}>
      <View style={styles.navigationView}>
        <Pressable
          onPress={navigateToHome}
          style={[styles.itemView, { backgroundColor: page === 'home' ? COLOR.main4 : COLOR.bg }]}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {page === 'home' ? <SelectedLogoIcon /> : <LogoIcon />}
            <Text
              style={[
                styles.itemText,
                {
                  color: page === 'home' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: page === 'home' ? 'Apple600' : 'Apple500',
                },
              ]}
            >
              홈
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={navigateToSocial}
          style={[styles.itemView, { backgroundColor: page === 'social' ? COLOR.main4 : COLOR.bg }]}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {page === 'social' ? <SelectedSocialIcon /> : <SocialIcon />}
            <Text
              style={[
                styles.itemText,
                {
                  color: page === 'social' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: page === 'social' ? 'Apple600' : 'Apple500',
                },
              ]}
            >
              소셜
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={navigateToWard}
          style={[styles.itemView, { backgroundColor: page === 'ward' ? COLOR.main4 : COLOR.bg }]}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {page === 'ward' ? <SelectedWardIcon /> : <WardIcon />}
            <Text
              style={[
                styles.itemText,
                {
                  color: page === 'ward' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: page === 'ward' ? 'Apple600' : 'Apple500',
                },
              ]}
            >
              병동
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    bottom: 10,
    borderTopColor: COLOR.sub45,
    borderTopWidth: 1,
    backgroundColor: COLOR.bg,
  },
  navigationView: {
    flexDirection: 'row',
    flex: 1,
    width: screenWidth,
    padding: 2,
    backgroundColor: COLOR.bg,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  itemView: { flex: 1, marginBottom: 40, alignItems: 'center', padding: 6, borderRadius: 10 },
  itemText: { fontSize: 12 },
});

export default NavigationBar;
