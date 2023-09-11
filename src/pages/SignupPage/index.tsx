import PageViewContainer from '@components/PageView';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrowIcon from '@assets/svgs/back-arrow.svg';
import { COLOR } from 'index.style';
import Name from './components/Name';
import useSignupPage from './index.hook';
import Profile from './components/Profile';

const SignupPage = () => {
  const {
    states: { step },
    actions: { onPressBack },
  } = useSignupPage();

  return (
    <PageViewContainer>
      <SafeAreaView style={styles.container}>
        <Pressable onPress={onPressBack}>
          <BackArrowIcon />
        </Pressable>
        <View style={styles.steps}>
          {[1, 2].map((item) => (
            <View
              style={[styles.step, { backgroundColor: step === item ? COLOR.main1 : COLOR.sub4 }]}
            >
              <Text style={styles.stepText}>{item}</Text>
            </View>
          ))}
        </View>
        {step === 1 && <Name />}
        {step === 2 && <Profile />}
      </SafeAreaView>
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
    height:23,
    color: 'white',
  },
});

export default SignupPage;
