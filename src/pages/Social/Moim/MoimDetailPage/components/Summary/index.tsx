import MonthSelector from '@components/MonthSelector';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAccountStore } from 'store/account';
import { useShiftTypeStore } from 'store/shift';

const Summary = () => {
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [setState, userId] = useAccountStore((state) => [state.setState, state.userId]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <MonthSelector />
        <ScrollView horizontal={true}></ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    marginVertical: 16,
    flexDirection: 'row',
  },
});

export default Summary;
