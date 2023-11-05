import { View } from "react-native";
import LottieView from 'lottie-react-native';
import { screenHeight, screenWidth } from "index.style";
import { hexToRgba } from "@libs/utils/color";

const LottieLoading = () => {
  return (
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
  );
};

export default LottieLoading;
