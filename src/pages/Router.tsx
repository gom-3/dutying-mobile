import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import GroupPage from './GroupPage';
import RegistDuty from './RegistDuty';
import RegistSchedulePage from './RegistSchedule';

export type StackParams = {
  Home: undefined;
  Group: undefined;
  RegistDuty: undefined;
  RegistSchedule: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen
          name="Group"
          component={GroupPage}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="RegistDuty" component={RegistDuty} />
        <Stack.Screen
          name="RegistSchedule"
          component={RegistSchedulePage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
