import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import GroupPage from './GroupPage';

export type StackParams = {
  Home: undefined;
  Group: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen
          name="Group"
          component={GroupPage}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
