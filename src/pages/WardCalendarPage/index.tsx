import PageViewContainer from '@components/PageView';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrevButton from '@assets/svgs/arrow-left.svg';
import NextButton from '@assets/svgs/arrow-right.svg';
import HumanIcon from '@assets/svgs/human.svg';
import NavigationBar from '@components/NavigationBar';
import { COLOR } from 'index.style';
import { days } from '@libs/utils/date';

const WardCalendarPage = () => {
  return (
    <PageViewContainer>
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 24,
            marginTop: 15,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Apple600',
              color: COLOR.main1,
              textDecorationLine: 'underline',
            }}
          >
            근무표
          </Text>
          <Pressable>
            <Text
              style={{ marginLeft: 20, fontFamily: 'Apple500', fontSize: 20, color: COLOR.sub3 }}
            >
              신청근무
            </Text>
          </Pressable>
        </View>
        <ScrollView style={{ paddingTop: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 24 }}>
            <Text style={{ color: COLOR.main1, fontFamily: 'Apple500', fontSize: 16 }}>
              7월 둘째 주
            </Text>
            <TouchableOpacity>
              <PrevButton />
            </TouchableOpacity>
            <TouchableOpacity>
              <NextButton />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
            {days.map((day, i) => (
              <TouchableOpacity key={day} style={styles.dayCard}>
                <Text
                  style={[
                    styles.dayCardText,
                    { color: i === 0 ? '#FF99AA' : i === 6 ? '#8B9BFF' : COLOR.sub25 },
                  ]}
                >
                  {day}
                </Text>
                <Text style={styles.dayCardDateText}>{i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            style={{ paddingLeft: 24, paddingTop: 24, paddingBottom: 42 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {['D', 'E', 'N', 'O'].map((shift) => (
              <View
                key={shift}
                style={{
                  borderColor: COLOR.sub45,
                  borderWidth: 0.5,
                  borderRadius: 10,
                  padding: 6,
                  width: 88,
                  marginRight: 12,
                  shadowColor: '#ede9f5',
                  shadowOpacity: 1,
                  backgroundColor: 'white',
                  shadowOffset: { width: 2, height: 2 },
                  shadowRadius: 10,
                  elevation:10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#4dc2ad',
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'Apple', fontSize: 14, color: 'white' }}>
                      {shift}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <HumanIcon />
                    <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: COLOR.sub3 }}>
                      4
                    </Text>
                  </View>
                </View>
                {['조성연', '김범진', '황인서', '김수정'].map((nurse) => (
                  <Text
                    style={{ margin: 6, color: COLOR.sub2, fontSize: 14, fontFamily: 'Apple500' }}
                  >
                    {nurse}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
      <NavigationBar page="ward" />
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  dayCard: {
    margin: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: COLOR.sub5,
    borderRadius: 5,
  },
  dayCardText: {
    fontSize: 10,
    fontFamily: 'Apple',
  },
  dayCardDateText: {
    color: COLOR.sub2,
    fontFamily: 'Poppins',
    fontSize: 16,
    marginTop: 7,
  },
});

export default WardCalendarPage;
