import { View, Text, StyleSheet, Platform, Pressable, Image } from 'react-native';
import NextArrowIcon from '@assets/svgs/next-arrow.svg';
import NextButton from '@components/NextButton';
import { COLOR } from 'index.style';
import useProfile from './index.hook';
import RandomIcon from '@assets/svgs/random.svg';
import CameraIcon from '@assets/svgs/camera.svg';

const Profile = () => {
  const {
    states: { image, photo, isPhoto, randomPressed, photoPressed },
    actions: { setRandomImage, setPhotoImage, setRandomPressed, setPhotoPressed },
  } = useProfile();
  return (
    <View>
      <View style={styles.guidTextWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.guideTextHighlight}>프로필 이미지</Text>
            <View style={styles.guideTextUnderline} />
          </View>
          <Text style={[styles.guideText, { marginTop: Platform.OS === 'android' ? 7 : 0 }]}>
            를
          </Text>
        </View>
        <Text style={[styles.guideText, { marginTop: 10 }]}>선택해주세요</Text>
      </View>
      <View style={styles.imageContainer}>
        {isPhoto ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Image source={image} style={styles.image} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPressIn={() => setRandomPressed(true)}
          onPressOut={() => setRandomPressed(false)}
          onPress={setRandomImage}
        >
          <View
            style={[
              styles.button,
              {
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                backgroundColor: randomPressed ? COLOR.main4 : 'white',
                borderColor: randomPressed ? COLOR.main1 : COLOR.sub3,
              },
            ]}
          >
            <RandomIcon />
            <Text style={[styles.buttonText, { color: randomPressed ? COLOR.main1 : COLOR.sub25 }]}>
              랜덤 변경
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPressIn={() => setPhotoPressed(true)}
          onPressOut={() => setPhotoPressed(false)}
          onPress={setPhotoImage}
        >
          <View
            style={[
              styles.button,
              {
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                backgroundColor: photoPressed ? COLOR.main4 : 'white',
                borderColor: photoPressed ? COLOR.main1 : COLOR.sub3,
              },
            ]}
          >
            <CameraIcon />
            <Text style={[styles.buttonText, { color: photoPressed ? COLOR.main1 : COLOR.sub25 }]}>
              사진 등록
            </Text>
          </View>
        </Pressable>
      </View>
      <NextButton text="다음" Icon={NextArrowIcon} onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 105,
    height: 40,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Apple',
    marginLeft: 9,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 105,
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
  guidTextWrapper: {
    justifyContent: 'center',
    marginTop: 42,
  },
  guideText: {
    fontFamily: 'Line',
    fontSize: 20,
    color: '#150b3c',
  },
  guideTextHighlight: {
    fontSize: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  guideTextUnderline: {
    height: 1,
    backgroundColor: '#150b3c',
  },
});

export default Profile;
