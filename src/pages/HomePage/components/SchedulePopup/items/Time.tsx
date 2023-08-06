import { COLOR } from 'index.style';
import { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import ClockIcon from '@assets/svgs/clock.svg';

const Time = () => {
  const [using, setUsing] = useState(false);

  return (
    <>
      <View style={styles.item}>
        <View style={styles.itemTitleWrapper}>
          <ClockIcon />
          <Text style={styles.itemTitle}>시간 설정</Text>
        </View>
        <Switch
          trackColor={{ true: COLOR.main1 }}
          thumbColor="white"
          value={using}
          onValueChange={(value) => setUsing(value)}
        />
      </View>
      {using && (
        <View style={styles.usingView}>
          <Text style={styles.itemTitle}>날짜</Text>
          <View style={styles.usingItemWrapper}>
            <Text style={styles.usingItemText}>7월 27일</Text>
          </View>
          <Text style={[styles.itemTitle, { marginTop: 14 }]}>시간</Text>
          <View style={styles.usingItemWrapper}>
            <Text style={styles.usingItemText}>오전 10:00 - 오후 5:00</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 10,
  },
  itemTitleWrapper: { flexDirection: 'row' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple', fontSize: 16, color: COLOR.sub25 },
  usingView: { marginHorizontal: 24, marginVertical: 5 },
  usingItemWrapper: { flexDirection: 'row' },
  usingItemTitle: { fontFamily: 'Apple', fontSize: 10, color: COLOR.sub3 },
  usingItemText: {
    marginTop: 4,
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default Time;
