import PageViewContainer from '@components/PageView';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrowIcon from '@assets/svgs/back-arrow.svg';
import { COLOR, screenHeight, screenWidth } from 'index.style';
import Name from './components/Name';
import useSignupPage from './index.hook';
import LottieView from 'lottie-react-native';
import { hexToRgba } from '@libs/utils/color';
import Gender from './components/Gender';
import Phone from './components/Phone';
import Code from './components/Code';

const EnterWardPage = () => {
  const {
    states: { step, isLoading },
    actions: { onPressBack },
  } = useSignupPage();

  return (
    <PageViewContainer withoutLogin>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onPressBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <View style={styles.steps}>
          {[1, 2, 3, 4].map((item) => (
            <View
              key={item}
              style={[styles.step, { backgroundColor: step === item ? COLOR.main1 : COLOR.sub4 }]}
            >
              <Text style={styles.stepText}>{item}</Text>
            </View>
          ))}
        </View>
        {step === 1 && <Name />}
        {step === 2 && <Gender />}
        {step === 3 && <Phone />}
        {step === 4 && <Code />}
      </SafeAreaView>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: hexToRgba('#000000', 0.3),
            left: 0,
            top: 0,
          }}
        >
          <LottieView
            style={{ width: 200, height: 200 }}
            source={require('@assets/animations/signup-animation.json')}
            autoPlay
            loop
          />
        </View>
      )}
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  steps: {
    flexDirection: 'row',
    marginTop: 24,
  },
  step: {
    width: 26,
    height: 26,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  stepText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    height: 23,
    color: 'white',
  },
});

export default EnterWardPage;
