import MonthSelector from '@components/MonthSelector';
import { ScrollView, View } from 'react-native';

const Summary = () => {
  return (
    <ScrollView>
      <View>
        <MonthSelector />
        <ScrollView></ScrollView>
      </View>
    </ScrollView>
  );
};

export default Summary;
