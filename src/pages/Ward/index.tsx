import NavigationBar from '@components/NavigationBar';
import NextButton from '@components/NextButton';
import PageViewContainer from '@components/PageView';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoubleArrowIcon from '@assets/svgs/double-right-arrow.svg';
import LogoIcon from '@assets/svgs/logo-selected.svg';
import { COLOR } from 'index.style';

const WardPage = () => {
  return (
    <PageViewContainer>
      <SafeAreaView
        style={{
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          height: '70%',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 30 }}>
          <Text style={{ color: COLOR.main1, fontSize: 32, fontFamily: 'Poppins600' }}>
            Coming soon
          </Text>
          <LogoIcon />
        </View>
        <View style={{ alignItems: 'center', margin: 30 }}>
          <Text>듀팅 웹사이트에서 근무표를 작성하면</Text>
          <Text>더 간편한 듀팅이 될 수 있어요!</Text>
        </View>
        <View style={{ width: '100%', margin: 30 }}>
          <NextButton text="우리 병동에 도입하기" onPress={() => {}} Icon={DoubleArrowIcon} />
        </View>
      </SafeAreaView>
      <NavigationBar page="ward" />
    </PageViewContainer>
  );
};

export default WardPage;
