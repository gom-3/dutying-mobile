import NavigationBar from '@components/NavigationBar';
import PageViewContainer from '@components/PageView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { COLOR } from 'index.style';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SortIcon from '@assets/svgs/sort.svg';
import PlusIcon from '@assets/svgs/plus-circle.svg';
import { images } from '@assets/images/profiles';

const MoimPage = () => {
  return (
    <PageViewContainer style={{ backgroundColor: '#fdfcfe' }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable>
              <Text style={[styles.headerText, { color: COLOR.sub25, fontFamily: 'Apple500' }]}>
                친구
              </Text>
            </Pressable>
            <Pressable>
              <Text
                style={[
                  styles.headerText,
                  {
                    marginLeft: 18,
                    color: COLOR.main1,
                    fontFamily: 'Apple600',
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                모임
              </Text>
            </Pressable>
          </View>
          <View style={styles.textWrapper}>
            <View>
              <Text style={styles.countText}>총 5모임</Text>
              <Text style={styles.guideText}>
                모임을 만들어 친구들의 근무표를 한번에 볼 수 있어요.
              </Text>
            </View>
            <View style={styles.sortOption}>
              <SortIcon />
              <Pressable>
                <Text style={styles.sortOptionText}>최신순</Text>
              </Pressable>
            </View>
          </View>
          <ScrollView style={styles.cardScrollView}>
            <TouchableOpacity style={styles.shadowWrapper}>
              <View>
                <Text style={styles.titleText}>곰세마리 병동 동기</Text>
                <Text style={styles.ownerText}>모임장 김범진</Text>
              </View>
              <View style={{ flexDirection: 'row', position: 'relative' }}>
                {[1, 2, 3].map((_, i) => (
                  <Image
                    style={[styles.profile, { right: 0 + (3 - i) * 18 }]}
                    source={images[i * 3]}
                  />
                ))}
                <View style={styles.profileCount}>
                  <Text style={styles.profileCountText}>+1</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.addButton}>
                <PlusIcon />
                <Text style={styles.addButtonText}>새로운 모임 생성하기</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        <NavigationBar page="social" />
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  countText: {
    fontFamily: 'Apple',
    fontSize: 12,
    color: COLOR.sub2,
  },
  guideText: {
    fontFamily: 'Apple',
    fontSize: 10,
    color: COLOR.sub3,
    marginTop: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionText: {
    fontFamily: 'Apple',
    fontSize: 12,
    color: COLOR.sub2,
    marginLeft: 2,
    textDecorationLine: 'underline',
  },
  cardScrollView: {
    height: '80%',
  },
  shadowWrapper: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: Platform.OS === 'android' ? '#b497ee' : '#ede9f5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    height: 70,
    elevation: 8,
    padding: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardItem: {},
  titleText: {
    color: COLOR.sub1,
    fontSize: 20,
    fontFamily: 'Apple600',
  },
  ownerText: {
    color: COLOR.sub25,
    fontFamily: 'Apple',
    fontSize: 12,
    marginTop: 8,
  },
  profile: {
    width: 28,
    height: 28,
    position: 'absolute',
    bottom: -15,
  },
  profileCount: {
    position: 'absolute',
    right: 0,
    bottom: -15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.main1,
    borderRadius: 100,
  },
  profileCountText: {
    fontFamily: 'Apple',
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.main3,
    margin: 24,
    padding: 12,
  },
  addButtonText: {
    fontFamily: 'Apple',
    fontSize: 14,
    color: COLOR.main1,
    marginLeft: 7,
  },
});

export default MoimPage;
