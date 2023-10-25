import PageHeader from '@components/PageHeader';
import PageViewContainer from '@components/PageView';
import { COLOR } from 'index.style';
import { View, Image, TouchableOpacity, Text, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccountStore } from 'store/account';
import PencilIcon from '@assets/svgs/edit-profile-pencil.svg';
import CheckIcon from '@assets/svgs/check-white.svg';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { editProfile } from '@libs/api/account';
import { images } from '@assets/images/profiles';
import { imageToBase64 } from '@pages/SignupPage/components/Profile/index.hook';
import RandomIcon from '@assets/svgs/random.svg';
import CameraIcon from '@assets/svgs/camera.svg';

const MyPage = () => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState(account.name);
  const [profile, setProfile] = useState(account.profileImgBase64);

  const { mutate: editProfileMutate } = useMutation(
    (image: string) => editProfile(name, image, account.accountId),
    {
      onSuccess: (data) => {
        setState('account', data);
      },
    },
  );

  const setRandomImage = async () => {
    const image = (await imageToBase64(images[Math.floor(Math.random() * 30)])) || profile;
    setProfile(image);
    editProfileMutate(image);
  };

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <SafeAreaView>
        <PageHeader title="내 정보" backgroundColor={COLOR.bg} />
      </SafeAreaView>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ position: 'relative', width: 60, height: 60 }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 100 }}
            source={{ uri: `data:image/png;base64,${account.profileImgBase64}` }}
          />
          <TouchableOpacity
            onPress={setRandomImage}
            activeOpacity={0.7}
            style={{ position: 'absolute', bottom: 0, right: -15 }}
          >
            <PencilIcon />
          </TouchableOpacity>
          <View style={{ position: 'absolute', bottom: 0, right: -80, backgroundColor: 'white' }}>
            <Pressable>
              <RandomIcon />
              <Text>랜덤 변경</Text>
            </Pressable>
            <Pressable>
              <CameraIcon />
              <Text>사진 등록</Text>
            </Pressable>
          </View>
        </View>
        {!isNameEditing ? (
          <Pressable
            onPress={() => setIsNameEditing(true)}
            style={{ marginTop: 14, borderBottomColor: COLOR.sub1, borderBottomWidth: 1 }}
          >
            <Text style={{ color: COLOR.sub1, fontFamily: 'Apple500', fontSize: 24 }}>
              {account.name}
            </Text>
          </Pressable>
        ) : (
          <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 28 }} />
            <TextInput
              defaultValue={account.name}
              style={{
                paddingVertical: 2,
                paddingHorizontal: 8,
                borderRadius: 5,
                backgroundColor: COLOR.main4,
                borderWidth: 1,
                borderColor: COLOR.main2,
                fontFamily: 'Apple500',
                fontSize: 24,
                color: COLOR.sub1,
              }}
            />
            <Pressable
              onPress={() => setIsNameEditing(false)}
              style={{
                marginLeft: 4,
                width: 24,
                height: 24,
                backgroundColor: COLOR.main2,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4.167,
              }}
            >
              <CheckIcon />
            </Pressable>
          </View>
        )}
      </View>
    </PageViewContainer>
  );
};

export default MyPage;
