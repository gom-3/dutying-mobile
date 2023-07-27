import { Button, View } from 'react-native';
import { StackParams } from '../Router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<StackParams, 'Home'>;

const HomePage = ({ navigation }: Props) => {
  return (
    <View>
      <Button title="test" onPress={() => navigation.navigate('Group')} />
    </View>
  );
};

export default HomePage;
