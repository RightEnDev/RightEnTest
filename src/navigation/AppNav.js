import { View, Text, SafeAreaView } from 'react-native'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
// import TabNavigator from './TabNavigator';
import TabNavigator from './TabNavigator';
import linking from '../linking';


const AppNav = () => {
  return (
    // <SafeAreaView>
      <NavigationContainer  linking={linking}>
        <StackNavigator />
      </NavigationContainer>
    // </SafeAreaView>

  )
}

export default AppNav;