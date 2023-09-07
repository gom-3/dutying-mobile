import PageViewContainer from '@components/PageView';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrowIcon from '@assets/svgs/back-arrow.svg';
import { useState } from 'react';

const SignupPage = () => {
  const [] = useState();

  return (
    <PageViewContainer>
      <SafeAreaView>
        <Pressable>
          <BackArrowIcon />
        </Pressable>
        <View>
          {[1, 2, 3].map((item) => (
            <Pressable>
              <View>
                <Text>{item}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </PageViewContainer>
  );
};

export default SignupPage;
