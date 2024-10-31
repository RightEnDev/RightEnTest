// App.js
import * as React from 'react';
import Example1 from '../screen/Example1';
import Example2 from '../screen/Example2';
import Example3 from '../screen/Example3';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import HomeScreen from '../screen/HomeScreen';
import DetailsScreen from '../screen/DetailsScreen';
import TabNavigator from './TabNavigator';
import Splash from '../screen/Splash';
import LoginScreen from '../screen/LoginScreen';
import Profile from '../screen/Profile';
import PriceChart from '../screen/PriceChart';
import History from '../screen/History';
import Settings from '../screen/Settings';
import Register from '../screen/Register';

const Stack = createNativeStackNavigator();

function StackNavigator(props) {
  const handleMenuToggle = () => {
    props.navigation.toggleDrawer();
  };
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
        // headerStyle: {
        //   backgroundColor: '#EE303B',
        // },
        // headerTintColor: '#FFFFFF',
        // headerTitleStyle: {
        //   fontSize: 20,
        // },
        // headerTitleAlign: 'center',
        // headerRight: () => (
        //   <TouchableOpacity onPress={handleMenuToggle}>
            
        //     <Text>touch</Text>
        //   </TouchableOpacity>
        // )
      })}
      initialRouteName='Splash'

    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />


      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="Example1" component={Profile} />
      <Stack.Screen name="Example2" component={PriceChart} />
      <Stack.Screen name="Example3" component={History} />
      <Stack.Screen name="Example4" component={Settings} />

      <Stack.Screen name="Details" component={DetailsScreen} />

    </Stack.Navigator>
  );
}

export default StackNavigator;
