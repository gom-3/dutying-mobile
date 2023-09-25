import { COLOR } from 'index.style';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OutsidePressHandler from 'react-native-outside-press';

interface Props {
  close: () => void;
}

const Actions = ({close}:Props) => {
  return (
    // <SafeAreaView style={styles.container}>
      <OutsidePressHandler style={styles.container} disabled={false} onOutsidePress={close}>
        <View style={styles.items}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>모임 초대</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>모임장 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>모임 내보내기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
            <Text style={styles.itemText}>모임 삭제</Text>
          </TouchableOpacity>
        </View>
      </OutsidePressHandler>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 80,
    right: 20,
    zIndex: 10,
  },
  items: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#848484',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 16,
    shadowOpacity: 0.25,
    elevation: 20,
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: COLOR.sub4,
    borderBottomWidth: 0.5,
  },
  itemText: {
    fontFamily: 'Apple500',
    fontSize: 16,
    color: COLOR.sub1,
  },
});

export default Actions;
