import { COLOR } from 'index.style';
import { ScrollView, View, Text, Platform, Pressable, StyleSheet } from 'react-native';
import OutSidePressHandler from 'react-native-outside-press';
import useDateSelector from './index.hook';
import UnderArrowIcon from '@assets/svgs/under-arrow.svg';

const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const DateSelector = () => {
  const {
    state: { date, isDateSelectorOpen },
    actions: { closeDateSelector, yearClickHandler, monthClickHandler, dateViewClickHander },
  } = useDateSelector();
  return (
    <View>
      <Pressable onPress={dateViewClickHander}>
        <View style={styles.datePresenterView}>
          <Text style={styles.datePresenterText}>
            {date.getFullYear()}년 {date.getMonth() + 1}월
          </Text>
          <UnderArrowIcon />
        </View>
      </Pressable>
      {isDateSelectorOpen && (
        <OutSidePressHandler
          onOutsidePress={closeDateSelector}
          disabled={false}
          style={styles.outSidePressContainer}
        >
          <View style={styles.dateSelectorView}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.yearScrollView}>
              {years.map((year) => (
                <Pressable key={year} onPress={() => yearClickHandler(year)}>
                  <View
                    style={[
                      styles.dateView,
                      {
                        width: 76,
                        backgroundColor: year === date.getFullYear() ? COLOR.main4 : 'white',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: year === date.getFullYear() ? COLOR.main1 : COLOR.main2,
                        },
                      ]}
                    >
                      {year}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.dateSelectorView, { marginLeft: 2 }]}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.monthScrollView}>
              {months.map((month) => (
                <Pressable key={month} onPress={() => monthClickHandler(month - 1)}>
                  <View
                    style={[
                      styles.dateView,
                      {
                        width: 47,
                        backgroundColor: month === date.getMonth() + 1 ? COLOR.main4 : 'white',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: month === date.getMonth() + 1 ? COLOR.main1 : COLOR.main2,
                        },
                      ]}
                    >
                      {month}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </OutSidePressHandler>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datePresenterView: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePresenterText: {
    fontFamily: 'Poppins',
    color: COLOR.main1,
    fontSize: 20,
    textDecorationLine: 'underline',
    textDecorationColor: COLOR.main1,
    marginRight: 5,
  },
  outSidePressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    // left: 24,
    // top: Platform.OS === 'ios' ? 90 : 70,
    top: 0,
    zIndex: 100,
    width: 125,
  },
  dateSelectorView: {
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    borderRadius: 5,
    elevation: 5,
    shadowColor: Platform.OS === 'ios' ? 'rgba(210, 199, 231, 1)' : 'black',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    height: 240,
  },
  yearScrollView: {
    width: 76,
    height: 240,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  dateView: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#e7e7ef',
    borderBottomWidth: 0.5,
  },
  dateText: {
    fontFamily: 'Poppins500',
    fontSize: 16,
  },
  monthScrollView: {
    width: 47,
    height: 240,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default DateSelector;
